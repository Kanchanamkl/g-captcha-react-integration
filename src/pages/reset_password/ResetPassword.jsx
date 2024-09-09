import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

   
    console.log('newPassword:', newPassword, 'confirmPassword:', confirmPassword);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        token,
        newPassword,
      }),
      });
      if (response.ok) {

        setNewPassword('');
        setConfirmPassword('');

        alert("Password reset successfully. Please login with your new password.");
        navigate("../g-captcha-react-integration/login")
      }else{
        alert("Error resetting password. Please try again.");
      }
      
    } catch (err) {
      //setError(err.response?.data?.error || 'Something went wrong');
    } finally {
        setIsLoading(false); 
      }
  };

  return (
    <div className="reset-pw-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type={passwordVisible ? 'text' : 'password'}
            id="password" 
            name="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>


          <button type="submit" className="reset-pw-btn">Reset Password</button>
        </form>
      </div>
      
      {isLoading && (
          <div className="loading-spinner">
            {/* Add your spinner animation here */}
            <div className="spinner"></div>
            <p></p>
          </div>
        )}
    </div>
  );
};

export default ResetPassword;
