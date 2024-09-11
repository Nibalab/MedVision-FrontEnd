import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../../Images/Logo2.png';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
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
            to="/messages"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Messages
          </NavLink>
        </li>
      </ul>
      <div className="navbar-logout">
        <FaSignOutAlt />
        <button onClick={() => alert('Logging out...')}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
