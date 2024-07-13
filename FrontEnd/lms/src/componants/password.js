import React, { useState } from "react";
import FunctionalComHead from './header/header';
import FunctionalComFooter from './footer/footer';
import './css/password.css';

function FunctionalComPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword === confirmPassword) {
      alert('Password updated successfully!');
    } else {
      alert('Passwords do not match!');
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