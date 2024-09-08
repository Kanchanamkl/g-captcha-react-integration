import React, { useState,useContext } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../../AuthContext';

const Login = () => {
  const APP_NAME = "g-captcha-react-integration";
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setIsLoggedIn, handleLogIn } = useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await response.json();
    if (data.status === 'success') {
      handleLogIn(email.value);
    } else {
      alert('Login failed: ' + data.error);
    }

    
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type={passwordVisible ? 'text' : 'password'}
            id="password" 
            name="password" 
            required 
            placeholder="Enter your password" 
          />
                <span 
                  onClick={togglePasswordVisibility} 
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50px',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                  }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
        </div>
        <button type="submit">Login</button>
        <div className="form-footer">
          <p>Don't have an account? <Link to={`../${APP_NAME}/register`}>Register here</Link></p>
          <p>Fogot or expired your password? <Link to={`../${APP_NAME}/reset-password-req`}>Reset Now</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
