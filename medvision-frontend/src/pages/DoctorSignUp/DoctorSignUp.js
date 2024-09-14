import React, { useState } from 'react';
import axios from 'axios';
import './DoctorSignUp.css'; 
import logo from '../../Images/Logo.png';

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    phoneNumber: '',
    password: '',
    password_confirmation: '',
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

 
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
        setErrorMessage('Passwords do not match');
        return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('specialization', formData.specialization);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('password', formData.password);
    data.append('password_confirmation', formData.password_confirmation); // Ensure this matches the backend expectation

    if (selectedFile) {
        data.append('profile_picture', selectedFile);
    }

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/doctor', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Doctor registered successfully:', response.data);
        setErrorMessage(''); // Clear any error messages
        // Redirect or show success message
    } catch (error) {
        console.error('Error registering doctor:', error);
        if (error.response) {
            // Print server-side validation errors
            setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
            if (error.response.data.errors) {
                for (const key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        console.log(error.response.data.errors[key]);
                    }
                }
            }
        }
    }
};


  return (
    <div className="doctor-signup-container">
      <div className="doctor-left-side">
        <form className="doctor-signup-box" onSubmit={handleSubmit}>
          <h2>Sign Up as a Doctor</h2>
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="specialization" 
            placeholder="Specialization" 
            value={formData.specialization} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="phoneNumber" 
            placeholder="Phone number" 
            value={formData.phoneNumber} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="password" 
            name="password_confirmation" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword} 
            onChange={handleInputChange} 
            required 
          />
          
          <div className="doctor-upload-button-wrapper">
            <label htmlFor="profile-picture" className="doctor-upload-button">
              Add Profile Picture
            </label>
            <input 
              type="file" 
              id="profile-picture" 
              style={{ display: 'none' }} 
              accept=".png, .jpg, .jpeg" 
              onChange={handleFileChange} 
            />
            {selectedFile && <span className="file-name">{selectedFile.name}</span>}
          </div>
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          
          <button type="submit" className="doctor-signup-button">Sign Up</button>
        </form>
      </div>
      <div className="doctor-right-side">
        <img src={logo} alt="MedVision Logo" className="doctor-logo" />
      </div>
    </div>
  );
};

export default DoctorSignup;
