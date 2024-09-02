import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from '../src/pages/SignupPage/SignupPage';
import DoctorSignup from '../src/pages/DoctorSignUp/DoctorSignUp';
import PatientSignup from '../src/pages/PatientSignUp/PatientSignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register/doctor" element={<DoctorSignup />} />
        <Route path="/register/patient" element={<PatientSignup />} />
        <Route path="/" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
