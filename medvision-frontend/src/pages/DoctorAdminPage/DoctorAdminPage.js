import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react'; // Import the trash icon from Lucide Icons
import SidebarAdmin from '../../components/SidebarAdmin/SidebarAdmin'; // Sidebar component
import './DoctorAdminPage.css';

const DoctorAdminPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize navigate
  
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      fetchDoctors();
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/admin/search-doctors?name=${event.target.value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error searching doctors:', error);
      }
    }
  };

  const deleteDoctor = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/doctors/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDoctors(); // Re-fetch doctors after deletion
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="doctor-admin-page">
      <SidebarAdmin /> {/* Sidebar component */}
      <div className="doctor-content">
        <h1>Doctor</h1>
       
        <input
          type="text"
          placeholder="Search for a Doctor"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <table className="doctor-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>
                    <button onClick={() => navigate(`/doctor/${doctor.id}`)} className="view-button">
                      View
                    </button>
                  </td>
                  <td>
                    {/* Trash icon for deletion */}
                    <Trash2 
                      className="delete-icon"
                      onClick={() => deleteDoctor(doctor.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No doctors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAdminPage;
