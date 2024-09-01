import React, { useState ,useEffect } from 'react';
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
   const [commonPasswords, setCommonPasswords] = useState([]);
   const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Load the common passwords from the JSON file
    fetch('http://localhost:5173/g-captcha-react-integration/common-passwords.json')
      .then((response) => response.json())
      .then((data) => {
        setCommonPasswords(data);
      })
      .catch((error) => {
        console.error('Error loading common passwords:', error);
      });
  }, []);


  const onCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaVerified(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;

    console.log("strength",strength);
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
      default:
        return '';
    }
  };

  const handlePasswordChange = (e) => {
    console.log("commonPasswords",commonPasswords);
    const newPassword = e.target.value;
    setPassword(newPassword);

    const strength = evaluatePasswordStrength(newPassword);
    setPasswordStrength(strength);

    if (commonPasswords.includes(newPassword)) {
      setPasswordError('This password is too common. Please choose a different one.');
    } else {
      setPasswordError('');
      const strength = evaluatePasswordStrength(newPassword);
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Very Weak':
        return 'red';
      case 'Weak':
        return 'orange';
      case 'Fair':
        return 'blue';
      case 'Moderate':
        return 'lightgreen';
      case 'Good':
        return '#218838';
      case 'Strong':
        return 'green';
      default:
        return '';
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'Very Weak':
        return '20%';
      case 'Weak':
        return '40%';
      case 'Fair':
        return '60%';
      case 'Moderate':
        return '80%';
      case 'Good':
        return '90%';
      case 'Strong':
        return '100%';
      case 'Very Strong':
        return '100%';
      default:
        return '0%';
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();


    if (commonPasswords.includes(password)) {
      alert("This password is too common. Please choose a different one.");
      return;
    }


    if(password.length <8){
      alert("Password should be at least 8 characters long");
      return;

    }
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



    console.log("response data :" ,data )
    console.log("response success :" ,data.status)
    if (data.status==='success') {
      alert('Login successful');
    } else {
      alert('Login failed: ' + data.error);
    }
   
   
 
   
    console.log("Email:", email);
    console.log("Password:", password);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            placeholder="First Name"
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            placeholder="Last Name"
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            placeholder="Email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <div style={{ position: 'relative' }}>
            <input 
              placeholder="Password"
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
     
          <div className="password-strength-bar-container">
            <div 
              className="password-strength-bar" 
              style={{
                width: getPasswordStrengthWidth(),
                backgroundColor: getPasswordStrengthColor(),
              }}
            />
          </div>
          <div 
            className="password-strength" 
            style={{ color: getPasswordStrengthColor() }}
          >
            {passwordStrength ? `Your Password is ${passwordStrength}` : ''}
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
  );
}

export default App;
