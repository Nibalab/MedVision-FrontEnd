import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa'; 
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
  const [appointmentRequests, setAppointmentRequests] = useState([]); 
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const getProfilePicture = (doctor) => {
    if (doctor.profile_picture && !doctor.profile_picture.startsWith('http')) {
      return `http://localhost:8000/storage/${doctor.profile_picture.replace('public/', '')}`;
    }
    return doctor.profile_picture || '/default-avatar.png';
  };

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
        appointmentsToday = [] 
      } = response.data;

      const confirmedAppointments = appointmentsToday.filter(appointment => appointment.status === 'confirmed');

      setStats({ totalCtScans, totalPatients, totalAppointmentsToday, newPatients, oldPatients });
      setAppointmentsToday(confirmedAppointments); 
    })
    .catch(error => {
      console.error('Error fetching stats:', error);
    });

    axios.get('http://127.0.0.1:8000/api/doctor-dashboard/pending-appointments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      setAppointmentRequests(response.data); 
    })
    .catch(error => {
      console.error('Error fetching pending appointments:', error);
    });
  }, []); 

  const showPatientDetails = (appointment) => {
    setSelectedAppointment(appointment); 
  };

  const closeModal = () => {
    setSelectedAppointment(null); 
  };

  const acceptAppointment = (appointmentId) => {
    const token = localStorage.getItem('token');
    axios.put(`http://127.0.0.1:8000/api/appointments/${appointmentId}/accept`, 
      { status: 'confirmed' }, 
      { headers: { Authorization: `Bearer ${token}` } })
    .then(() => {
      setAppointmentRequests(prevRequests => prevRequests.filter(req => req.id !== appointmentId));
    })
    .catch(error => {
      console.error('Error accepting appointment:', error);
    });
  };

  const declineAppointment = (appointmentId) => {
    const token = localStorage.getItem('token');
    axios.put(`http://127.0.0.1:8000/api/appointments/${appointmentId}/decline`, 
      { status: 'canceled' }, 
      { headers: { Authorization: `Bearer ${token}` } })
    .then(() => {
      setAppointmentRequests(prevRequests => prevRequests.filter(req => req.id !== appointmentId));
    })
    .catch(error => {
      console.error('Error declining appointment:', error);
    });
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
              {Array.isArray(appointmentsToday) && appointmentsToday.length > 0 ? (
                appointmentsToday.map((appointment, index) => (
                  <li 
                    key={index} 
                    className="appointment-item"
                    onClick={() => showPatientDetails(appointment)}>
                    {appointment.patient.name} - {appointment.appointment_time}
                  </li>
                ))
              ) : (
                <p>No appointments for today.</p>
              )}
            </ul>
          </div>
        </div>
        <div className="appointment-requests-container">
          <h3>Appointment Requests</h3>
          <ul>
            {Array.isArray(appointmentRequests) && appointmentRequests.length > 0 ? (
              appointmentRequests.map((request, index) => (
                <li key={index} className="appointment-request-item">
                  {request.patient.name} - {request.appointment_date} at {request.appointment_time}
                  <div className="action-icons">
                    <FaCheck className="accept-icon" onClick={() => acceptAppointment(request.id)} />
                    <FaTimes className="decline-icon" onClick={() => declineAppointment(request.id)} />
                  </div>
                </li>
              ))
            ) : (
              <p>No appointment requests at the moment.</p>
            )}
          </ul>
        </div>
        {selectedAppointment && (
          <div className="modal-background" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Patient Details</h2>
              {selectedAppointment.patient.profile_picture && (
                <img 
                  src={getProfilePicture(selectedAppointment.patient)}  // Using getProfilePicture function
                  alt={`${selectedAppointment.patient.name}'s profile`} 
                  className="patient-profile-picture"
                />
              )}
              <p><strong>Name:</strong> {selectedAppointment.patient.name}</p>
              <p><strong>Email:</strong> {selectedAppointment.patient.email}</p>
              <p><strong>Gender:</strong> {selectedAppointment.patient.gender}</p>
              <p><strong>Appointment Time:</strong> {selectedAppointment.appointment_time}</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
