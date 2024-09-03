import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Upload, Calendar, User, MessageSquare, LogOut } from 'lucide-react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = () => {
  const [doctorName, setDoctorName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        navigate('/'); // Redirect to login if token is not available
        return;
      }

      axios.get('http://127.0.0.1:8000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        const user = response.data.user;
        setDoctorName(user.name);
        setProfilePicture(user.profile_picture);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      });
    }, 500); // Small delay of 500ms for debugging
  }, [navigate]);

  return (
    <div className="sidebar-container">
      <div className="profile-section">
        <img 
          src={profilePicture ? `http://127.0.0.1:8000/storage/${profilePicture.replace('public/', '')}` : '/path/to/default-profile-picture.jpg'} 
          alt="Profile" 
          className="profile-picture" 
        />
        <h2 className="doctor-name">Dr. {doctorName}</h2>
      </div>
      <nav className="menu-items">
        <NavLink 
          to="/doctor-dashboard" 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/upload" 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
        >
          <Upload size={20} />
          <span>Upload</span>
        </NavLink>
        <NavLink 
          to="/schedule" 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
        >
          <Calendar size={20} />
          <span>Schedule</span>
        </NavLink>
        <NavLink 
          to="/patient" 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
        >
          <User size={20} />
          <span>Patient</span>
        </NavLink>
        <NavLink 
          to="/messages" 
          className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}
        >
          <MessageSquare size={20} />
          <span>Messages</span>
        </NavLink>
      </nav>
      <div className="logout-section">
        <NavLink to="/logout" className="menu-item">
          <LogOut size={20} />
          <span>Log out</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
