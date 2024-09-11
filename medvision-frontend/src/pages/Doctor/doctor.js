import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar'; // Assuming the paths to components
import Footer from '../../components/Footer/Footer';
import './doctor.css'; // Create this CSS file for styling

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDoctors = async (name) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8000/api/doctors/search?name=${name}`);
            setDoctors(response.data);
            console.log(response.data);  // Debug: Check the response structure
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.response?.data?.message || 'Error fetching doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            fetchDoctors(searchTerm);
        }
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="doctor-page-container">
            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <div className="doctor-page-content">
                <div className="doctor-search">
                    <input
                        type="text"
                        placeholder="Search for a doctor"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                {/* Loading and error messages */}
                {loading && <p>Loading doctors...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Doctors list */}
                <div className="doctors-list">
                    {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                            <div key={doctor.id} className="doctor-item">
                                <img
                                    src={doctor.profile_picture || '/default-avatar.png'}
                                    alt={doctor.name}
                                    className="doctor-avatar"
                                />
                                <h3>{doctor.name}</h3>
                                <p>{doctor.specialization || 'Specialization not available'}</p>
                                <button className="appointment-btn">Make an Appointment</button>
                            </div>
                        ))
                    ) : (
                        <p>No doctors found</p>
                    )}
                </div>

                {/* Pagination/Navigation - Example */}
                <div className="doctor-pagination">
                    <button className="prev-page">&lt;</button>
                    <button className="next-page">&gt;</button>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default DoctorsPage;
