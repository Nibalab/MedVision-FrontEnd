import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReportsPage.css';
import { FaDownload, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ReportsPage = () => {
  const [reports, setReports] = useState([]); // Store all reports for the patient
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state

  const token = localStorage.getItem('token');
  const reportsPerPage = 10; // Number of reports to show per page

  // Function to download the report from the database
  const handleDownloadReport = async (reportId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reports/download/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.pdf`); // Specify file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  // Fetch reports for the patient
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/patient/reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Reports:', response.data.reports); // Log to inspect response

        const fetchedReports = response.data.reports;
        setReports(fetchedReports.slice(0, reportsPerPage)); // Show first page
        setTotalPages(Math.ceil(fetchedReports.length / reportsPerPage)); // Calculate total pages
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports(); // Fetch reports when the component mounts
  }, [token, reportsPerPage]);

  // Handle switching pages
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const startIndex = (nextPage - 1) * reportsPerPage;
      setReports(reports.slice(startIndex, startIndex + reportsPerPage)); // Update visible reports
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const startIndex = (prevPage - 1) * reportsPerPage;
      setReports(reports.slice(startIndex, startIndex + reportsPerPage)); // Update visible reports
    }
  };

  return (
    <div className="reports-page-container">
      <Navbar /> {/* Navbar component */}
      <div className="main-content reports-page">
        <h1>Reports</h1>
        <div className="table-container">
  <table className="patient-table">
    <thead>
      <tr>
        <th>Doctor</th>
        <th>Specialization</th>
        <th>Email</th>
        <th>Download</th>
      </tr>
    </thead>
    <tbody>
      {reports.length > 0 ? (
        reports.map((report) => (
          <tr key={report.id}>
            <td>{report.doctor.name}</td>
            <td>{report.doctor.specialization}</td>
            <td>{report.doctor.email}</td>
            <td>
              <button
                className="download-button"
                onClick={() => handleDownloadReport(report.id)}
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

        {/* Pagination Section */}
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
      <Footer /> {/* Footer component */}
    </div>
  );
};

export default ReportsPage;
