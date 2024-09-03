import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const doctorName = "Dr. Example";
  const profilePicture = "/path/to/profile-picture.jpg"; // Update this path

  return (
    <div className="doctor-dashboard-container">
      <Sidebar profilePicture={profilePicture} name={doctorName} />
      <div className="main-content">
        <h1>Dashboard</h1>
        {/* Other dashboard content */}
      </div>
    </div>
  );
};

export default DoctorDashboard;
