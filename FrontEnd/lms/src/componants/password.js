import React, { useState } from "react";
import FunctionalComHead from './header/header';
import FunctionalComFooter from './footer/footer';
import {Link, useNavigate} from "react-router-dom";
import './css/password.css';

function FunctionalComPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/update-password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/'); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred while updating the password. Please try again later.');
    }
  }

  return (
    <div className="password--card-container">
      <FunctionalComHead />
      <div className="password--content-wrap">
        <div className="password--form">
          <form onSubmit={handleSubmit}>
            <div className="password--form-page">
              <h1 className="password--heading">Update Password</h1>

              <div className="password--labels">
                <label>New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="password--labels">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="btn">
                <input className="submit" type="submit" value="Update Password" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <FunctionalComFooter />
    </div>
  );
}

export default FunctionalComPassword;
