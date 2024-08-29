import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import logo from '../../Images/Logo.png';

const SignupPage = () => {
    const navigate = useNavigate();
  
    const handleDoctorSignup = () => {
      navigate('/register/doctor');
    };
  
    const handlePatientSignup = () => {
      navigate('/register/patient');
    };
  
    return (
      <div className="signup-container">
        <div className="left-side">
          <img src={logo} alt="MedVision Logo" className="logo" />
        </div>
        <div className="right-side">
          <h2>SignUp</h2>
          <button className="signup-button doctor" onClick={handleDoctorSignup}>
            Sign up as a doctor
          </button>
          <button className="signup-button patient" onClick={handlePatientSignup}>
            Sign up as a patient
          </button>
        </div>
      </div>
    );
  };
  
  export default SignupPage;