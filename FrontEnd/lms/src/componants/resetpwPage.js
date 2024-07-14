import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import FunctionalComHead from './header/header';
import FunctionalComFooter from './footer/footer';
import './css/resetpwPage.css';

function FunctionalComLogin() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/otprepwd'); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An error occurred while resetting the password. Please try again later.');
    }
  }

  return (
    <div className="prp_card-container1">
      <FunctionalComHead />
      <div className="prp_content-wrap">
        <div className="prp_loginform">
          <form onSubmit={handleSubmit}>
            <div className="prp_formpage">
              <p className="prp_p1">To reset password, enter your user email</p>
              <h1 className="prp_h1">Reset Password</h1>
              
              <div className="prp_labels">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email.."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="btn">
                <input className="submit" type="submit" value="Reset Password" />
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
