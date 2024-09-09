import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from '../src/pages/SignupPage/SignupPage';
import DoctorSignup from '../src/pages/DoctorSignUp/DoctorSignUp';
import PatientSignup from '../src/pages/PatientSignUp/PatientSignUp';
import LoginPage from '../src/pages/Login/Login'; 
import Dashboard from '../src/pages/DoctorDashboard/DoctorDashboard';
import Schedule from '../src/pages/SchedulePage/SchedulePage';
import Messages from './pages/ChatPage/ChatPage';
import io from 'socket.io-client';  // Import Socket.IO client

function App() {
  useEffect(() => {
    // Initialize the connection to the Socket.IO server
    const socket = io('http://localhost:3001'); // Ensure this matches your socket server's URL and port

    // Handle connection event
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);  // Empty dependency array to run once when the component mounts

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
      </Routes>
    </Router>
  );
}

export default App;
