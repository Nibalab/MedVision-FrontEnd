import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 
import logo from '../../Images/Logo.png';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make the API request to login
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);

      // Extract the token and user role from the response
      const { token, user } = response.data;

      // Store the token in local storage
      localStorage.setItem('token', token);

      // Navigate based on user role
      const { role } = user;
      if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (role === 'patient') {
        navigate('/patient-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-side">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleInputChange} 
            required 
          />
          <div className="login-options">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </div>
          <div className="login-terms-wrapper">
            <input type="checkbox" className="terms-checkbox" id="terms-checkbox" required />
            <label htmlFor="terms-checkbox">
                Accept the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
            </label>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button">Login</button>
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </form>
      </div>
      <div className="login-right-side">
        <img src={logo} alt="MedVision Logo" className="login-logo" />
      </div>
    </div>
  );
};

export default LoginPage;
