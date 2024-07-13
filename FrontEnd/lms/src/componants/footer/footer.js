import React, { useState } from "react";
import './footer.css';

function FunctionalComFooter() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The email you entered was: ${email} with message: ${message}`);
  }

  return (
    <div className="footer">
      <div className="footer-section footer-contact">
        <h3>Contact Us</h3>
        <p>Email: LoyalLMS@gmail.com</p>
        <p>Phone: 0253765498</p>
        <p>Address: 20 Main St, Anuradhapura Town, Sri Lanka.</p>
      </div>

      <div className="footer-section footer-about">
        <h3>About Us</h3>
        <p>Welcome to the Loyal Library Management System. On this page, you can:</p>
        <ul>
          <li>Search for books by title, author, or subject</li>
          <li>Check the availability of books and other resources</li>
        </ul>
      </div>

      <div className="footer-section footer-form">
        <h3>Chat with Us</h3>
        <div className="footer-box">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              name="message"
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FunctionalComFooter;