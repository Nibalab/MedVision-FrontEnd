import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from '../src/pages/SignupPage/SignupPage';
import DoctorSignup from '../src/pages/DoctorSignUp/DoctorSignUp';
import PatientSignup from '../src/pages/PatientSignUp/PatientSignUp';
import LoginPage from '../src/pages/Login/Login'; 
import Dashboard from '../src/pages/DoctorDashboard/DoctorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/register/doctor" element={<DoctorSignup />} />
        <Route path="/register/patient" element={<PatientSignup />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/doctor-dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
