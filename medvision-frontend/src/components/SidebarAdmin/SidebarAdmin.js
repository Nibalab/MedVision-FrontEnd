import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import axios from 'axios';
import './SidebarAdmin.css';

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      localStorage.removeItem('token');
      navigate('/');
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <div className="sidebar-admin-container">
      <div className="admin-section">
        <h2 className="admin-name">Admin</h2>
      </div>
      <nav className="menu-items-admin">
        <NavLink 
          to="/admin-dashboard" 
          className={({ isActive }) => isActive ? "menu-item-admin active" : "menu-item-admin"}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/doctors" 
          className={({ isActive }) => isActive ? "menu-item-admin active" : "menu-item-admin"}
        >
          <User size={20} />
          <span>Doctors</span>
        </NavLink>
        <NavLink 
          to="/patients" 
          className={({ isActive }) => isActive ? "menu-item-admin active" : "menu-item-admin"}
        >
          <User size={20} />
          <span>Patients</span>
        </NavLink>
      </nav>
      <div className="logout-section-admin">
        <NavLink to="/" className="menu-item-admin" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Log out</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarAdmin;
