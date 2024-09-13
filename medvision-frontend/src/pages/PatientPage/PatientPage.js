import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientPage.css';
import { FaDownload, FaFileAlt } from 'react-icons/fa'; // Using icons from react-icons
import Sidebar from '../../components/Sidebar/Sidebar'; // Add Sidebar Component

const PatientPage = () => {
  const [patients, setPatients] = useState([]); // Initialize as an empty array
  const [filteredPatients, setFilteredPatients] = useState([]); // Initialize as an empty array
  const [searchQuery, setSearchQuery] = useState('');

  // Function to fetch patients
  const fetchPatients = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/patients', {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });
  
      // Log response to inspect structure
      console.log(response.data);
  
      if (response.data.success && Array.isArray(response.data.patients.data)) {
        setPatients(response.data.patients.data); // Extract array if nested inside 'data'
        setFilteredPatients(response.data.patients.data); // Initialize filtered patients
      } else {
        console.error('API did not return an array of patients:', response.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };
  

  // Function to download the patient report
  const handleDownload = async (patientId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${patientId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${patientId}_report.pdf`); // Specify file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Function to handle search by patient name
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredPatients(patients); // Show all patients when search is empty
    } else if (Array.isArray(patients)) {
      const filtered = patients.filter((patient) =>
        patient.name.toLowerCase().includes(query)
      );
      setFilteredPatients(filtered);
    }
  };

  useEffect(() => {
    // Fetch patients when the component mounts
    fetchPatients();
  }, []);

  return (
    <div className="patient-page-container">
      <Sidebar /> {/* Sidebar component */}
      <div className="main-content patient-page">
        <h1>Patients</h1>
        <input
          type="text"
          placeholder="Search for Patient by name"
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />

        <table className="patient-table">
          <thead>
            <tr>
              <th>Id no</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Download</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <button
                      className="download-button"
                      onClick={() => handleDownload(patient.id)}
                    >
                      <FaDownload />
                    </button>
                  </td>
                  <td>
                    <button className="report-button">
                      <FaFileAlt />
                    </button>
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
      </div>
    </div>
  );
};

export default PatientPage;
