import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './PatientDashboard.css';
import { FiDownload } from 'react-icons/fi'; // Icon for the download button

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [notifications, setNotifications] = useState({
    messages: [],
    confirmedAppointments: [],
    newReports: [],
  });
  const [latestReport, setLatestReport] = useState(null); // Store latest report
  const [nextAppointment, setNextAppointment] = useState(null); // Store next confirmed appointment

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

    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch new messages from doctors
        const messagesResponse = await axios.get('http://127.0.0.1:8000/api/patient/message', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch confirmed appointments
        const appointmentsResponse = await axios.get('http://127.0.0.1:8000/api/patient/confirmed-appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Get future appointments and find the next one
        const futureAppointments = appointmentsResponse.data.confirmedAppointments.filter(appointment => 
          new Date(appointment.appointment_date) > new Date()
        );
        const nextConfirmedAppointment = futureAppointments.length > 0 ? futureAppointments[0] : null;
        setNextAppointment(nextConfirmedAppointment);

        // Fetch new reports uploaded by doctors
        const reportsResponse = await axios.get('http://127.0.0.1:8000/api/patient/new-reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set notifications state
        setNotifications({
          messages: messagesResponse.data.messages || [],
          confirmedAppointments: appointmentsResponse.data.confirmedAppointments || [],
          newReports: reportsResponse.data.newReports || [],
        });
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const fetchLatestReport = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/patient/latest-report', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLatestReport(response.data.latestReport);
      } catch (error) {
        console.error('Error fetching latest report:', error);
      }
    };

    fetchPatientInfo();
    fetchNotifications();
    fetchLatestReport();
  }, []);

  const downloadReport = async () => {
    const token = localStorage.getItem('token');
    
    if (!patient || !patient.id) {
      console.error('Patient ID is missing');
      return;
    }
  
    const patientId = patient.id;
  
    try {
      const response = await axios.get(`http://127.0.0.1:8000/patients/${patientId}/download-report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',  // Ensure response is treated as a file
      });
  
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf');  // Specify file name
      document.body.appendChild(link);
      link.click();
      link.remove();
  
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  if (!patient) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <div className="patient-dashboard-container">
      <Navbar />
      <div className="patient-dashboard-content">
        <div className="patient-profile">
          <div className="profile-picture">
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
              {notifications.messages.length > 0 ? (
                notifications.messages.map((message, index) => (
                  <li key={index}>
                    {message.doctor && message.doctor.name ? (
                      `You have a new message from Dr. ${message.doctor.name}`
                    ) : (
                      'You have a new message'
                    )}
                  </li>
                ))
              ) : (
                <li>No new messages</li>
              )}

              {notifications.confirmedAppointments.length > 0 ? (
                notifications.confirmedAppointments.map((appointment, index) => (
                  <li key={index}>
                    Your appointment with Dr. {appointment.doctor.user.name} on {new Date(appointment.appointment_date).toLocaleDateString()} has been confirmed
                  </li>
                ))
              ) : (
                <li>No confirmed appointments</li>
              )}

              {notifications.newReports.length > 0 ? (
                notifications.newReports.map((report, index) => (
                  <li key={index}>
                    {report.doctor && report.doctor.name ? (
                      `Dr. ${report.doctor.name} has uploaded a new report on ${new Date(report.uploaded_at).toLocaleDateString()}`
                    ) : (
                      'A new report has been uploaded'
                    )}
                  </li>
                ))
              ) : (
                <li>No new reports</li>
              )}
            </ul>
          </div>

          <div className="recent-reports">
            <h3>Recent Report</h3>
            {latestReport ? (
              <div>
                <p><strong>{latestReport?.ctScan?.name || 'CT Scan'}</strong></p>
                <p>{new Date(latestReport?.created_at).toLocaleDateString()}</p>
                <p>Uploaded by Dr. {latestReport?.doctor?.name || 'Unknown'}</p>
                <button className="download-report-button" onClick={downloadReport}>
                  <FiDownload /> Download
                </button>
              </div>
            ) : (
              <p>No recent report available</p>
            )}
          </div>

          <div className="next-appointment">
            <h3>Next Appointment</h3>
            {nextAppointment ? (
              <div>
                <p>{new Date(nextAppointment.appointment_date).toLocaleDateString()}</p>
                <p>{nextAppointment.appointment_time} - Dr. {nextAppointment.doctor.user.name} ~ {nextAppointment.doctor.specialization}</p>
              </div>
            ) : (
              <p>No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const getProfilePicture = (patient) => {
  if (patient.profile_picture && !patient.profile_picture.startsWith('http')) {
    return `http://localhost:8000/storage/${patient.profile_picture.replace('public/', '')}`;
  }
  return patient.profile_picture || '/default-avatar.png';
};

export default PatientDashboard;
