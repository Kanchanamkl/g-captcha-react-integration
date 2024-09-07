const express = require('express');
const axios = require('axios');
const mongoose = require("mongoose");
const router = express.Router();
const UserModel = require('../models/User');


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

const users = [];

router.get('/users', (req, res) => {
  res.json(users);
})

router.post('/register', async (req, res) => {
  const {firstName, lastName, email, password, recaptchaToken } = req.body;


  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const userId = users.length + 1;
  users.push({
    userId,
    email,
    password,
    firstName,
    lastName,
    status: 'active',
  })

  const newUser = new UserModel({
    userId,
    firstName,
    lastName,
    email,
    password,
    status: 'active',
  });

  await newUser.save();


  console.log('All users: ', users);

  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LdA2ioqAAAAAFsbBtzHyFw3V-YhY-c0N42A_JUJ'; 
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
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

   
    console.log('reCAPTCHA verified successfully');
    res.status(200).json({ message: 'Login successful' , status: 'success'});
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working properly' });
});

module.exports = router;