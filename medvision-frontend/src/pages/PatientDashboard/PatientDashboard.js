import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './PatientDashboard.css';

const PatientDashboard = () => {
  return (
    <div className="patient-dashboard-container">
      <Navbar />
      
      <div className="patient-dashboard-content">
        {/* Content for the home page */}
        <div className="patient-dashboard-header">
          <h2>Welcome, John Dohn</h2>
          <p>29 July, 1982</p>
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
              <a href="#">View</a>
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
