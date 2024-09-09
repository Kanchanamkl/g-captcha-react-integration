import React, { useState } from "react";
import "./ResetPasswordReq.css";

function ResetPasswordReq() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/auth/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setIsModalOpen(true);
        setEmail("");
      } else {
        alert("Error sending reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading once request finishes
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="reset-password-req-container">
        <h2>Forgot or Expaired Password?</h2>
        <p>Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">
            Send Reset Link
          </button>
        </form>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h3>Check Your Email</h3>
              <p>
                A reset password link has been sent to your email. Please check
                your inbox.
              </p>
              <button className="close-modal-button" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-spinner">
            {/* Add your spinner animation here */}
            <div className="spinner"></div>
            <p>Sending email...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ResetPasswordReq;
