const express = require('express');
const axios = require('axios'); // Import axios for HTTP requests
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, recaptchaToken } = req.body;


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

module.exports = router;