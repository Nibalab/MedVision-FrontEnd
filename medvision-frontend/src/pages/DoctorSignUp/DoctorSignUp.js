import React from 'react';
import './DoctorSignUp.css'; 
import logo from '../../Images/Logo.png';

const DoctorSignup = () => {
  return (
    <div className="doctor-signup-container">
      <div className="doctor-left-side">
        <div className="doctor-signup-box">
          <h2>Sign Up as a Doctor</h2>
          <div className="doctor-input-group">
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
          </div>
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Specialization" />
          <input type="text" placeholder="Phone number" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button className="doctor-upload-button">Add Profile Picture</button>
          <button className="doctor-signup-button">Sign In</button>
        </div>
      </div>
      <div className="doctor-right-side">
        <img src={logo} alt="MedVision Logo" className="doctor-logo" />
      </div>
    </div>
  );
};

export default DoctorSignup;
