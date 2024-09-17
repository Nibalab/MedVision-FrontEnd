import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin/SidebarAdmin'; 
import DoctorSummaryChart from '../../components/DoctorSummaryChart/DoctorDummaryChart';
import PatientSummaryChart from '../../components/PatientSummaryChart/PatientSummaryChart';
import axios from 'axios';
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    newDoctors: 0,
    oldDoctors: 0,
    totalDoctors: 0,
    newPatients: 0,
    oldPatients: 0,
    totalPatients: 0,
  });

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    
    axios.get('http://127.0.0.1:8000/api/admin-dashboard/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const { newDoctors, oldDoctors, totalDoctors, newPatients, oldPatients, totalPatients } = response.data;
      setStats({
        newDoctors,
        oldDoctors,
        totalDoctors,
        newPatients,
        oldPatients,
        totalPatients,
      });
    })
    .catch(error => {
      console.error('Error fetching admin stats:', error);
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <SidebarAdmin />  
      <div className="admin-dashboard-content">
        <h1>Summary</h1>

        <div className="summary-charts-container">
          <div className="summary-chart">
            <h3>Doctor Summary </h3>
            <DoctorSummaryChart 
              newDoctors={stats.newDoctors}
              oldDoctors={stats.oldDoctors}
              totalDoctors={stats.totalDoctors}
            />
          </div>


          <div className="summary-chart">
            <h3>Patient Summary </h3>
            <PatientSummaryChart 
              newPatients={stats.newPatients}
              oldPatients={stats.oldPatients}
              totalPatients={stats.totalPatients}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
