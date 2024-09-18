import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2 } from 'lucide-react'; // Import the pen icon from Lucide Icons
import SidebarAdmin from '../../components/SidebarAdmin/SidebarAdmin'; // Sidebar component
import './PatientAdminPage.css';

const PatientAdminPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPatient, setEditingPatient] = useState(null); // State to track patient being edited
  
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      fetchPatients();
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/admin/search-patients?name=${event.target.value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error searching patients:', error);
      }
    }
  };

  const deletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPatients(); // Re-fetch patients after deletion
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient); // Set the patient being edited
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/admin/patients/${editingPatient.user_id}`, editingPatient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPatients(); // Refresh the list after saving
      setEditingPatient(null); // Close the modal
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const getProfilePicture = (patient) => {
    if (patient.profile_picture && !patient.profile_picture.startsWith('http')) {
      return `http://localhost:8000/storage/${patient.profile_picture.replace('public/', '')}`;
    }
    return patient.profile_picture || '/default-avatar.png';
  };

  return (
    <div className="patient-admin-page">
      <SidebarAdmin /> {/* Sidebar component */}
      <div className="patient-content">
        <h1>Patients</h1>
       
        <input
          type="text"
          placeholder="Search for a Patient"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <table className="patient-table">
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
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>
                    {/* Pen icon for editing */}
                    <Edit2 
                      className="edit-icon"
                      onClick={() => handleEditClick(patient)}
                    />
                  </td>
                  <td>
                    {/* Trash icon for deletion */}
                    <Trash2 
                      className="delete-icon"
                      onClick={() => deletePatient(patient.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No patients found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal for editing a patient */}
        {editingPatient && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Patient</h2>
              
              {/* Display profile picture */}
              <img
                src={getProfilePicture(editingPatient)}
                alt={`${editingPatient.name}'s profile`}
                className="patient-profile-pic"
              />
              
              {/* Editable fields */}
              <input
                type="text"
                placeholder="Name"
                value={editingPatient.name}
                onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={editingPatient.email}
                onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={editingPatient.contact_number || ''}
                onChange={(e) => setEditingPatient({ ...editingPatient, contact_number: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                value={editingPatient.address || ''}
                onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
              />
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={() => setEditingPatient(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAdminPage;
