import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FaSearch, FaCheckCircle, FaArrowLeft } from 'react-icons/fa'; 
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'; 
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import './doctor.css';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('10:00');
    const [patientId, setPatientId] = useState(null);
    const [showModal, setShowModal] = useState(false); 

    const getProfilePicture = (doctor) => {
        if (doctor.profile_picture && !doctor.profile_picture.startsWith('http')) {
            return `http://localhost:8000/storage/${doctor.profile_picture.replace('public/', '')}`;
        }
        return doctor.profile_picture || '/default-avatar.png';
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded); 
                setPatientId(decoded.id || decoded.sub); 
            } catch (err) {
                console.error("Error decoding token:", err);
                alert('Invalid token, please log in again.');
            }
        } else {
            alert('Patient ID not sent, please log in.');
        }
    }, []);

    
    const fetchDoctors = async (name) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8000/api/doctors/search?name=${name}`);
            setDoctors(response.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.response?.data?.message || 'Error fetching doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const delayDebounceFn = setTimeout(() => {
                fetchDoctors(searchTerm);
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAppointmentClick = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        if (!patientId) {
            alert('Patient ID not found, please log in.');
            return;
        }

        const appointmentData = {
            patient_id: patientId,  
            doctor_id: selectedDoctor.id,
            appointment_date: selectedDate.toISOString().split('T')[0],  
            appointment_time: selectedTime
        };

        try {
            const response = await axios.post('http://localhost:8000/api/appointments', appointmentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            });
            setShowModal(true); 
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting appointment:', error);
            alert('Failed to submit appointment. Please try again.');
        }
    };

    const closeModal = () => {
        setShowModal(false); 
    };

    return (
        <div className="doctor-page-container">
            <Navbar />

            <div className="doctor-page-content">
                {selectedDoctor ? (
                    <>
                        
                        <button className="back-to-search-btn" onClick={() => setSelectedDoctor(null)}>
                            <FaArrowLeft /> Back to Search
                        </button>

                        <div className="appointment-container">
                            <div className="doctor-info">
                                <img
                                    src={getProfilePicture(selectedDoctor)}
                                    alt={selectedDoctor.name}
                                    className="doctor-avatar-large"
                                />
                                <h3>{selectedDoctor.name}</h3>
                                <p>{selectedDoctor.specialization}</p>
                                <div className="doctor-contact-info">
                                    <p><FaMapMarkerAlt /> {selectedDoctor.address || 'Location not available'}</p>
                                    <p><FaEnvelope /> {selectedDoctor.email}</p>
                                    <p><FaPhone /> {selectedDoctor.contact_number || 'Phone number not available'}</p>
                                </div>
                            </div>

                            <div className="appointment-form">
                                <h3>Request an appointment</h3>
                                <form onSubmit={handleAppointmentSubmit}>
                                    <div className="appointment-form-row">
                                        <div className="calendar">
                                            <label>Choose a date:</label>
                                            <Calendar
                                                onChange={setSelectedDate}
                                                value={selectedDate}
                                            />
                                        </div>

                                        <div className="time-picker">
                                            <label>Choose a time:</label>
                                            <TimePicker
                                                onChange={setSelectedTime}
                                                value={selectedTime}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="appointment-submit-btn">Submit</button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="doctor-search">
                            <div className="search-bar-container">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for a doctor"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        {loading && <p>Loading doctors...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div className="doctors-list">
                            {doctors.length > 0 ? (
                                doctors.map((doctor) => (
                                    <div key={doctor.id} className="doctor-item">
                                        <img
                                            src={getProfilePicture(doctor)}
                                            alt={doctor.name}
                                            className="doctor-avatar"
                                        />
                                        <div className="doctor-details">
                                            <h3>{doctor.name}</h3>
                                            <p>{doctor.specialization || 'Specialization not available'}</p>
                                        </div>
                                        <button
                                            className="appointment-btn"
                                            onClick={() => handleAppointmentClick(doctor)}
                                        >
                                            Make an Appointment
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No doctors found</p>
                            )}
                        </div>

                        <div className="pagination-container">
                            <button className="prev-page">&lt;</button>
                            <button className="next-page">&gt;</button>
                        </div>
                    </>
                )}
            </div>

            <Footer />

            {/* Success Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <FaCheckCircle className="success-icon" />
                        <p className="modal-message">Appointment request submitted successfully!</p>
                        <button className="modal-close-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorsPage;
