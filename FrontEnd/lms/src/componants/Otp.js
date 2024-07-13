import React, { useState } from "react";
import FunctionalComHead from './header/header';
import FunctionalComFooter from './footer/footer';
import { useNavigate } from "react-router-dom";
import './css/Otp.css';

function FunctionalComLogin() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("OTP before sending to backend:", otp);
  
    try {
      const response = await fetch('http://localhost:4000/verify-otp', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({ otp }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        navigate('/bookpage');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error');
    }
  };
  
  

  return (
    <div className="otp-card-container">
      <FunctionalComHead />
      <div className="otp-content-wrap">
        <div className="otp-login-form">
          <form onSubmit={handleSubmit}>
            <div className="otp-form-page">
              <p className="otp-instructions">To reset your password, enter the OTP sent to your registered email.</p>
              <h1 className="otp-heading">OTP Verification</h1>
              <div className="otp-labels">
                <label>OTP:</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP..."
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="btn">
                <input className="submit" type="submit" value="Submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <FunctionalComFooter />
    </div>
  );
}

export default FunctionalComLogin;
