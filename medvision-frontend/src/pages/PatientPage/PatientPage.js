import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientPage.css';
import { FaDownload, FaUpload, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar/Sidebar';

const PatientPage = () => {
  const [allPatients, setAllPatients] = useState([]); 
  const [filteredPatients, setFilteredPatients] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [selectedFiles, setSelectedFiles] = useState({}); 

  const token = localStorage.getItem('token');
  const patientsPerPage = 10; 

  const handleFileChange = (e, patientId) => {
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [patientId]: e.target.files[0],
    }));
  };


  const handleStoreReport = async (patientId) => {
    const file = selectedFiles[patientId];
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('report_document', file);
      formData.append('patient_id', patientId); 

      const response = await axios.post(`http://127.0.0.1:8000/api/patients/${patientId}/upload-report`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Report uploaded successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error uploading report:', error);
    }
  };

  const handleDownloadReport = async (patientId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${patientId}/download-report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${patientId}_report.pdf`); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const startIndex = (nextPage - 1) * patientsPerPage;
      setFilteredPatients(allPatients.slice(startIndex, startIndex + patientsPerPage)); 
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const startIndex = (prevPage - 1) * patientsPerPage;
      setFilteredPatients(allPatients.slice(startIndex, startIndex + patientsPerPage)); 
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      const startIndex = (currentPage - 1) * patientsPerPage;
      setFilteredPatients(allPatients.slice(startIndex, startIndex + patientsPerPage));
    } else {
      const filtered = allPatients.filter((patient) =>
        patient.name.toLowerCase().includes(query)
      );
      setFilteredPatients(filtered); 
      setTotalPages(1); 
    }
  };

  useEffect(() => {
    const fetchAllPatients = async () => {
      try {
        let page = 1;
        let allFetchedPatients = [];
        let lastPage = 1;
        
        do {
          const response = await axios.get('http://127.0.0.1:8000/api/patients', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: page,
            },
          });

          const { data, last_page } = response.data.patients;
          allFetchedPatients = [...allFetchedPatients, ...data];
          lastPage = last_page;
          page++;
        } while (page <= lastPage);

        // Update states
        setAllPatients(allFetchedPatients); // Store all patients
        setFilteredPatients(allFetchedPatients.slice(0, patientsPerPage)); // Show first page
        setTotalPages(Math.ceil(allFetchedPatients.length / patientsPerPage)); // Calculate total pages

      } catch (error) {
        console.error('Error fetching all patients:', error);
      }
    };

    fetchAllPatients(); // Fetch all patients when the component mounts
  }, [token, patientsPerPage]);

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
              <th>Download Report</th>
              <th>Upload Report</th>
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
                      onClick={() => handleDownloadReport(patient.id)}
                    >
                      <FaDownload />
                    </button>
                  </td>
                  <td>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, patient.id)}
                    />
                    <button
                      className="upload-button"
                      onClick={() => handleStoreReport(patient.id)}
                    >
                      <FaUpload />
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

        {/* Pagination Section */}
        {searchQuery === '' && ( // Show pagination only if no search query is active
          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <FaArrowLeft /> Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPage;
