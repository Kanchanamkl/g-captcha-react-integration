import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OTPVerification.css"; 

function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (data.status === "success") {
      alert(data.message);
      navigate("../g-captcha-react-integration/login");
    } else {
      alert(data.error);
      return;
    }
  };

  return (
    <div className="otp-verification-page">
      <h2>Verify your OTP</h2>
      <h3>Enter the OTP sent to {email}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            placeholder="Enter OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
}

export default OTPVerification;
