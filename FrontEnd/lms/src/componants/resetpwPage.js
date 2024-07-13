import { useState } from "react";
import { Link } from "react-router-dom";
import FunctionalComHead from './header/header';
import FunctionalComFooter from './footer/footer';
import './css/resetpwPage.css';

function FunctionalComLogin() {
  const [uid, setUid] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`The email you entered was: ${uid} `);
  }

  return (
    <div className="prp_card-container1">
      <FunctionalComHead />
      <div className="prp_content-wrap">
        <div className="prp_loginform">
          <form onSubmit={handleSubmit}>
            <div className="prp_formpage">
              <p class="prp_p1">To reset password enter your user id</p>
              <h1 className="prp_h1">Reset password </h1>
              
              <div className="prp_labels">
                <label>UserId:</label>
                <input
                  type="text"
                  name="uid"
                  placeholder="Enter your user id.."
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                />
                
              </div>
             
              
              <div className="btn">
                <input className="submit" type="submit" />
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
