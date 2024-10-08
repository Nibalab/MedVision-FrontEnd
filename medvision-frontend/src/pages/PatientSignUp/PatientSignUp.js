import React, { useState } from 'react';
import axios from 'axios';
import './PatientSignUp.css'; 
import logo from '../../Images/Logo.png';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
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

    if (formData.password !== formData.password_confirmation) {
        setErrorMessage('Passwords do not match');
        return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('gender', formData.gender);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('password', formData.password);
    data.append('password_confirmation', formData.password_confirmation); 

    if (selectedFile) {
        data.append('profile_picture', selectedFile);
    }

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/register/patient', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Patient registered successfully:', response.data);
        setErrorMessage(''); 
    } catch (error) {
        console.error('Error registering patient:', error);
        if (error.response) {
            console.log('Server validation errors:', error.response.data.errors);
            setErrorMessage('Registration failed. Please check the form fields.');
            if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
        }
    }
};

  return (
    <div className="patient-signup-container">
      <div className="patient-left-side">
        <form className="patient-signup-box" onSubmit={handleSubmit}>
          <h2>Sign Up as a Patient</h2>
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
          <select 
            name="gender" 
            value={formData.gender} 
            onChange={handleInputChange} 
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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
            value={formData.password_confirmation} 
            onChange={handleInputChange} 
            required 
          />
          
          <div className="patient-upload-button-wrapper">
            <label htmlFor="profile-picture" className="patient-upload-button">
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
          
          <button type="submit" className="patient-signup-button">Sign Up</button>
        </form>
      </div>
      <div className="patient-right-side">
        <img src={logo} alt="MedVision Logo" className="patient-logo" />
      </div>
    </div>
  );
};

export default PatientSignup;
