import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const doctorName = "Dr. Example";
  const profilePicture = "/path/to/profile-picture.jpg"; 

  return (
    <div className="doctor-dashboard-container">
      <Sidebar profilePicture={profilePicture} name={doctorName} />
      <div className="main-content">
        <h2>Dashboard</h2>
      </div>
    </div>
  );
};

export default DoctorDashboard;
