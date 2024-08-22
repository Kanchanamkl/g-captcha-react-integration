import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './App.css'


function App() {
 
   const [captchaVerified, setCaptchaVerified] = useState(false);
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordStrength, setPasswordStrength] = useState('');
   const [showPassword, setShowPassword] = useState(false);



  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaVerified(true);
  };



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  const evaluatePasswordStrength = (password) => {
    console.log('password', password);
    let strength = 0;
    console.log('strength', strength);
    if (password.length >= 4) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    console.log('strength', strength);

    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Moderate';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      case 6:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const strength = evaluatePasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!captchaVerified) {
      alert("Please complete the CAPTCHA");
      return;
    }
  
    const recaptchaToken = grecaptcha.getResponse(); 
  
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        recaptchaToken,
      }),
    });
  
     const data = await response.json();
    if (data.success) {
      alert('Login successful');
    } else {
      // alert('Login failed: ' + data.error);
      alert('Login successful');
    }

    // console.log("response data :" ,data )
    // console.log("response success :" ,data.status)
    // if (data.status==='success') {
    //   alert('Login successful');
    // } else {
    //   alert('Login failed: ' + data.error);
    // }
   
   
    console.log("Email:", email);
    console.log("Password:", password);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Very Weak':
        return 'red';
      case 'Weak':
        return 'orange';
      case 'Fair':
        return 'yellow';
      case 'Good':
        return '#218838';
      case 'Strong':
        return 'green';
      case 'Moderate':
        return 'blue';
      case 'Very Strong':
        return 'green';  
      default:
        return '';
    }
  };
  return (
    <>

<div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={handlePasswordChange} 
              required 
              style={{ paddingRight: '40px' }}
            />
            <span 
              onClick={togglePasswordVisibility} 
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
     
       
          <div 
            className="password-strength" 
            style={{ color: getPasswordStrengthColor() }}
          >
            
           {/* {passwordStrength ? `Your Password is ${passwordStrength}` : ''} */}
           {passwordStrength !== '' ? `Your Password is ${passwordStrength}` : ''}
          </div>
        </div>
        <div className="form-group">
          <ReCAPTCHA
            sitekey="6LdA2ioqAAAAAPYQpm6b2YPZ_Arj1nHvI6TIMV1a"
            onChange={onCaptchaChange}
          />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>


    </>
  )
}

export default App
