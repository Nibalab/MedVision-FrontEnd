import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../Images/Logo2.png';
import { FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    // Call the backend API to perform logout
    axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      localStorage.removeItem('token'); // Remove the token from local storage
      navigate('/'); // Redirect to the login or home page after logout
    })
    .catch((error) => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="MedVision Logo" />
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/patient-dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/reports"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/doctors"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Doctors
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Patient-messages"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Messages
          </NavLink>
        </li>
      </ul>
      <div className="navbar-logout">
        <FaSignOutAlt />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
