import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from '../src/pages/SignupPage/SignupPage';
import DoctorSignup from '../src/pages/DoctorSignUp/DoctorSignUp';
import PatientSignup from '../src/pages/PatientSignUp/PatientSignUp';
import LoginPage from '../src/pages/Login/Login'; 
import Dashboard from '../src/pages/DoctorDashboard/DoctorDashboard';
import Schedule from '../src/pages/SchedulePage/SchedulePage';
import Messages from './pages/ChatPage/ChatPage';
import PatientDashboard from '../src/pages/PatientDashboard/PatientDashboard';
import Doctor from './pages/Doctor/doctor';
import ChatPatient from './pages/ChatPatient/ChatPatient';
import Patient from './pages/PatientPage/PatientPage';
import Reports from './pages/ReportsPage/ReportsPage';
import io from 'socket.io-client';  

function App() {
  useEffect(() => {
    const socket = io('http://localhost:3001'); 
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    return () => {
      socket.disconnect();
    };
  }, []);  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/register/doctor" element={<DoctorSignup />} />
        <Route path="/register/patient" element={<PatientSignup />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/doctor-dashboard" element={<Dashboard />} /> 
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/messages" element={<Messages />} /> 
        <Route path="/patient-dashboard" element={<PatientDashboard />} /> 
        <Route path="/doctors" element={<Doctor />} /> 
        <Route path="/Patient-messages" element={<ChatPatient />} /> 
        <Route path="/patient" element={<Patient />} /> 
        <Route path="/reports" element={<Reports />} /> 
      </Routes>
    </Router>
  );
}

export default App;
