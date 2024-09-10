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
          <NavLink exact to="/" activeClassName="active">Home</NavLink>
        </li>
        <li>
          <NavLink to="/reports" activeClassName="active">Reports</NavLink>
        </li>
        <li>
          <NavLink to="/doctors" activeClassName="active">Doctors</NavLink>
        </li>
        <li>
          <NavLink to="/messages" activeClassName="active">Messages</NavLink>
        </li>
      </ul>
      <div className="navbar-logout">
        <FaSignOutAlt />
        <button onClick={() => alert("Logging out...")}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
