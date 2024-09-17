import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2 } from 'lucide-react'; // Import the pen icon from Lucide Icons
import SidebarAdmin from '../../components/SidebarAdmin/SidebarAdmin'; // Sidebar component
import './DoctorAdminPage.css';

const DoctorAdminPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null); // State to track doctor being edited
  
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

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor); // Set the doctor being edited
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Log the object to see if all fields are correctly set before sending
      console.log('Doctor being edited:', editingDoctor);
      
      // Use user_id for the PUT request
      await axios.put(`http://127.0.0.1:8000/api/admin/doctors/${editingDoctor.user_id}`, editingDoctor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Fetch the updated doctor list
      fetchDoctors();
      
      // Close the modal
      setEditingDoctor(null);
    } catch (error) {
      console.error('Error saving doctor:', error);
      
      // Log server response in case of validation errors
      if (error.response) {
        console.error('Server response data:', error.response.data);
      }
    }
  };
  
  

  const getProfilePicture = (doctor) => {
    if (doctor.profile_picture && !doctor.profile_picture.startsWith('http')) {
      return `http://localhost:8000/storage/${doctor.profile_picture.replace('public/', '')}`;
    }
    return doctor.profile_picture || '/default-avatar.png';
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
              <th>Edit</th>
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
                    {/* Pen icon for editing */}
                    <Edit2 
                      className="edit-icon"
                      onClick={() => handleEditClick(doctor)}
                    />
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

        {/* Modal for editing a doctor */}
        {editingDoctor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Doctor</h2>
              
              {/* Display profile picture */}
              <img
                src={getProfilePicture(editingDoctor)}
                alt={`${editingDoctor.name}'s profile`}
                className="doctor-profile-pic"
              />
              
              {/* Editable fields */}
              <input
                type="text"
                placeholder="Name"
                value={editingDoctor.name}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={editingDoctor.email}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Specialization"
                value={editingDoctor.specialization || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={editingDoctor.contact_number || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, contact_number: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                value={editingDoctor.address || ''}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, address: e.target.value })}
              />
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={() => setEditingDoctor(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAdminPage;
