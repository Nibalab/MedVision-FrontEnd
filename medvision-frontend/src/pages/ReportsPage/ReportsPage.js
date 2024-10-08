import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReportsPage.css';
import { FaDownload, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ReportsPage = () => {
  const [reports, setReports] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  const token = localStorage.getItem('token');
  const reportsPerPage = 10; 

  const handleDownloadReport = async (report) => {
    try {
      const patientId = report.patient_id; // Use patient_id from the report object
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${patientId}/download-report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_patient_${patientId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };
  
  

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/patient/reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Reports:', response.data.reports); 

        const fetchedReports = response.data.reports;
        setReports(fetchedReports.slice(0, reportsPerPage)); 
        setTotalPages(Math.ceil(fetchedReports.length / reportsPerPage)); 
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports(); 
  }, [token, reportsPerPage]);

  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const startIndex = (nextPage - 1) * reportsPerPage;
      setReports(reports.slice(startIndex, startIndex + reportsPerPage)); 
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const startIndex = (prevPage - 1) * reportsPerPage;
      setReports(reports.slice(startIndex, startIndex + reportsPerPage)); 
    }
  };

  return (
    <div className="reports-page-container">
      <Navbar /> 
      <div className="main-content reports-page">
        <h1>Reports</h1>
        <div className="table-container">
  <table className="patient-table">
    <thead>
      <tr>
        <th>Doctor</th>
        <th>Email</th>
        <th>Download</th>
      </tr>
    </thead>
    <tbody>
      {reports.length > 0 ? (
        reports.map((report) => (
          <tr key={report.id}>
            <td>{report.doctor.name}</td>
            <td>{report.doctor.email}</td>
            <td>
              <button
                className="download-button"
                onClick={() => handleDownloadReport(report)}
              >
                <FaDownload />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4">No reports found</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

       
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
      </div>
      <Footer />
    </div>
  );
};

export default ReportsPage;
