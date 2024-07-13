import { useState } from "react";
import FunctionalComHead from './header/header';
import FunctionalComFooter from './footer/footer';
import {Link, useNavigate} from "react-router-dom";
import './css/registerPage.css';

function FunctionalComReg() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ConPassword, setConPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== ConPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          mobileNumber: phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/otp'); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error registering user');
    }
  };

  return (
    <div className="card-container">
      <FunctionalComHead />
      <div className="content-wrap">
        <form onSubmit={handleSubmit}>
          <div className="formpage">
            <h1 className="h1">Register Page</h1>
            <div className="labels">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username.."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email.."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password.."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Confirm Password:</label>
              <input
                type="password"
                name="ConPassword"
                placeholder="Confirm your password.."
                value={ConPassword}
                onChange={(e) => setConPassword(e.target.value)}
              />
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number.."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="btn">
              <input className="submit" type="submit" />
            </div>
          </div>
        </form>
      </div>
      <FunctionalComFooter />
    </div>
  );
}

export default FunctionalComReg;
