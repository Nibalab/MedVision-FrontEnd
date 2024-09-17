import React from 'react';
import SidebarAdmin from '../../components/SidebarAdmin/SidebarAdmin';  // Make sure this path is correct
import './AdminDashboard.css';  // Custom CSS for the Admin Dashboard

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <SidebarAdmin />  {/* Sidebar for the admin dashboard */}
      <div className="admin-dashboard-content">
        <div className="dashboard-summary">
          {/* Here you can include the summary components for doctors and patients */}
          <h2>Welcome to the Admin Dashboard</h2>
          <p>Manage Doctors, Patients, and other key system features here.</p>
          
          {/* Summary components for example */}
          <div className="summary-section">
            {/* Insert other components like summary charts or other content here */}
            <h3>Overview</h3>
            {/* Add summary or stats here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
