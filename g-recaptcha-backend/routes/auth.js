const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = express.Router();
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "4b6eebcd839bf6f7154f598f7f4397c799d15e06ad4c6b783f1d0f33e76a5b7edfe4b8b2f714f10b5c5dcbbbecc1f6d63271f8f15532f31a0b228756a5f3c2b0"; // Keep your secret safe and secure

const PASSWORD_EXPIRATION_DAYS = 10;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_IN_MINUTES = 5;


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "madhuranga829@gmail.com",
    pass: "kfdjehrpjqvcjemc",
  },
});


mongoose
  .connect("mongodb://localhost:27017/secure-api-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

router.get("/users", (req, res) => {
  UserModel.find().then((users) => res.json(users));
});

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, recaptchaToken } = req.body;

  const secretKey =
    process.env.RECAPTCHA_SECRET_KEY ||
    "6LdA2ioqAAAAAFsbBtzHyFw3V-YhY-c0N42A_JUJ";
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(verificationURL, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    const data = response.data;

    if (!data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    console.log("reCAPTCHA verified successfully");

    // insert user into database

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    //salt and hashing
    const salt = await bcrypt.genSalt(10);
    console.log("salt", salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      status: "active",
      passwordExpiryDate: new Date(
        Date.now() + PASSWORD_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
      ),
      failedLoginAttempts: 0,
      lockUntil: null,
      passwordHistory: [hashedPassword] 
    });

    await newUser.save();

    res
      .status(200)
      .json({ message: "Registration successful", status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // check if user is locked

    if (existingUser.lockUntil) {
      const lockUntil = new Date(existingUser.lockUntil);
      const timeLeft = (lockUntil - Date.now()) / 1000 / 60; // in minutes
      if (lockUntil > new Date()) {
        return res
          .status(400)
          .json({
            error: `Your account is locked. Please try again in ${Math.ceil(
              timeLeft
            )} minutes.`,
          });
      }
    }

    // check if password has expired
    const today = new Date();
    const passwordExpireDate = new Date(existingUser.passwordExpiryDate);

    console.log("today ", today, "passwordExpireDate", passwordExpireDate);
    if (today > passwordExpireDate) {
      return res
        .status(400)
        .json({ error: "Your password has expired. Please update it." });
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    // check if user is locked
    if (!isPasswordValid) {
      const failedLoginAttempts = existingUser.failedLoginAttempts + 1;
      console.log("failedLoginAttempts", failedLoginAttempts);
      if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
        console.log("Account locked");
        const lockUntil = new Date(
          Date.now() + LOCK_TIME_IN_MINUTES * 60 * 1000
        );
        await UserModel.findByIdAndUpdate(existingUser._id, {
          failedLoginAttempts: 0,
          lockUntil: lockUntil,
          status: "locked",
        });
      } else {
        await UserModel.findByIdAndUpdate(existingUser._id, {
          failedLoginAttempts: failedLoginAttempts,
        });
      }
      return res.status(400).json({ error: "Incorrect password" });
    } else {
      await UserModel.findByIdAndUpdate(existingUser._id, {
        failedLoginAttempts: 0,
        status: "active",
        lockUntil: null,
      });
    }

    res.status(200).json({
      message: "Login successful",
      status: "success",
      user: existingUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});



router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email }); 
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    const resetURL = `http://localhost:5173/g-captcha-react-integration/reset-password?token=${resetToken}`;


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password: \n\n${resetURL}\n\nThis link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    useNewUrlParser;
    console.error(error);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("token", token, "newPassword", newPassword);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;
    console.log("email", email);

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found for this email!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);



    //check is contains hashedPassword in passwordHistory array by bcript compare
    if (user.passwordHistory.some((password) =>
        bcrypt.compareSync(newPassword, password)
      )
    ) {
      console.log("This Password already used");
      return res.status(400).json({ error: "Password already used" });
    }

    // add new passoword also to password hsistory array
    user.passwordHistory.push(hashedPassword);


    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. Please login with your new password." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
