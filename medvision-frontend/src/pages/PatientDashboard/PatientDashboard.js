import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);

  const getProfilePicture = (patient) => {
    if (patient.profile_picture && !patient.profile_picture.startsWith('http')) {
      return `http://localhost:8000/storage/${patient.profile_picture.replace('public/', '')}`;
    }
    return patient.profile_picture || '/default-avatar.png';
  };

  useEffect(() => {
    const fetchPatientInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatient(response.data.user);
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    };

    fetchPatientInfo();
  }, []);

  if (!patient) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <div className="patient-dashboard-container">
      <Navbar />
      
      <div className="patient-dashboard-content">
        <div className="patient-profile">
          <div className="profile-picture">
            {/* If the patient has a profile picture, display it; otherwise, use a placeholder */}
            <img
              src={getProfilePicture(patient)}
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <h2>{patient.name}</h2>
            <p>{new Date(patient.birth_date).toLocaleDateString()}</p>
            <div className="profile-details">
              <p><strong>Location:</strong> {patient.location || 'Not provided'}</p>
              <p><strong>Phone:</strong> {patient.phone || 'Not provided'}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Gender:</strong> {patient.gender || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div className="patient-dashboard-body">
          <div className="notifications">
            <h3>Notifications</h3>
            <ul>
              <li>You have 1 message from Dr. Kadi</li>
              <li>Your upcoming appointment needs confirmation</li>
              <li>Your recent Report has been annotated</li>
            </ul>
          </div>

          <div className="recent-reports">
            <h3>Recent Reports</h3>
            <div>
              <p><strong>Brain CT Scan</strong></p>
              <p>8/6/2024</p>
              <p>Annotated</p>
              {/* Change <a> to a <button> for non-navigable action */}
              <button className="view-report-button">View</button>
            </div>
          </div>

          <div className="next-appointment">
            <h3>Next Appointment</h3>
            <p>Tuesday, 10 August 2024</p>
            <p>10:00 AM - Dr. Rami Kadi ~ Neurologist</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PatientDashboard;
