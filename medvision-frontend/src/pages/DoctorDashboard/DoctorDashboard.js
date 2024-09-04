import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import PatientSummaryChart from '../../components/PatientSummaryChart/PatientSummaryChart';
import axios from 'axios';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalCtScans: 0,
    totalPatients: 0,
    totalAppointmentsToday: 0,
    newPatients: 0,
    oldPatients: 0,
  });

  const [appointmentsToday, setAppointmentsToday] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    axios.get('http://127.0.0.1:8000/api/doctor-dashboard/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const { 
        totalCtScans, 
        totalPatients, 
        totalAppointmentsToday, 
        newPatients, 
        oldPatients, 
        appointmentsToday 
      } = response.data;

      setStats({ totalCtScans, totalPatients, totalAppointmentsToday, newPatients, oldPatients });
      setAppointmentsToday(appointmentsToday); // Set today's appointments
    })
    .catch(error => {
      console.error('Error fetching stats:', error);
    });
  }, []);

  const showPatientDetails = (appointment) => {
    alert(`Patient Name: ${appointment.patient.name}\nTime: ${appointment.appointment_time}`);
  };

  return (
    <div className="doctor-dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h2>Dashboard</h2>
        <div className="stats-container">
          <div className="stat-box">
            <h3>Total CT Scans</h3>
            <p>{stats.totalCtScans}</p>
          </div>
          <div className="stat-box">
            <h3>Total Patients</h3>
            <p>{stats.totalPatients}</p>
          </div>
          <div className="stat-box">
            <h3>Total Appointments Today</h3>
            <p>{stats.totalAppointmentsToday}</p>
          </div>
        </div>

        {/* Container to hold chart and appointments side by side */}
        <div className="chart-and-appointments-container">
          <div className="chart-container">
            <PatientSummaryChart 
              newPatients={stats.newPatients} 
              oldPatients={stats.oldPatients} 
              totalPatients={stats.totalPatients} 
            />
          </div>
          <div className="appointments-container">
            <h3>Today's Appointments</h3>
            <ul>
              {appointmentsToday.map((appointment, index) => (
                <li 
                  key={index} 
                  className="appointment-item"
                  onClick={() => showPatientDetails(appointment)}>
                  {appointment.patient.name} - {appointment.appointment_time}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
