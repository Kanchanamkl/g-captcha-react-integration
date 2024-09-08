const express = require('express');
const axios = require('axios');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = express.Router();
const UserModel = require('../models/User');

const PASSWORD_EXPIRATION_DAYS = 10;


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


router.get('/users', (req, res) => {
  UserModel.find().then((users) => res.json(users));
})

router.post('/register', async (req, res) => {
  const {firstName, lastName, email, password, recaptchaToken } = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LdA2ioqAAAAAFsbBtzHyFw3V-YhY-c0N42A_JUJ'; 
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    // captcha verification
    const response = await axios.post(verificationURL, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    const data = response.data;

    if (!data.success) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

   
    console.log('reCAPTCHA verified successfully');


    // insert user into database

    const existingUser = await UserModel.findOne({email});
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }


    //salt and hashing
    const salt = await bcrypt.genSalt(10);
    console.log("salt", salt); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password : hashedPassword,
      status: 'active',
      passwordExpiryDate: new Date(Date.now() + PASSWORD_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    });
  
    await newUser.save();

    res.status(200).json({ message: 'Login successful' , status: 'success'});
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {

    const existingUser = await UserModel.findOne({email});

    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }


    const today = new Date();
    const passwordExpireDate = new Date(existingUser.passwordExpiryDate);
    // const passwordExpireDate = new Date(existingUser.passwordLastChanged.getTime() + PASSWORD_EXPIRATION_MINS * 60 * 1000);

    console.log('today ',today,"passwordExpireDate", passwordExpireDate);
    if (today > passwordExpireDate) {
      return res.status(400).json({ error: 'Your password has expired. Please update it.' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' , status: 'success', user: existingUser});
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working ' });
});

module.exports = router;