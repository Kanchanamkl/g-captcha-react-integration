import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResetPassword.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Get the token from the URL query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple password match validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // try {
    //   const response = await axios.post('http://localhost:8080/reset-password', {
    //     token,
    //     newPassword,
    //   });
    //   setSuccess(response.data.message);
    //   setTimeout(() => navigate('/login'), 2000); // Redirect after success
    // } catch (err) {
    //   setError(err.response?.data?.error || 'Something went wrong');
    // }
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

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="reset-pw-btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
