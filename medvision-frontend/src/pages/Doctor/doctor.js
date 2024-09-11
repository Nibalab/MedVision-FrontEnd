import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { FaSearch } from 'react-icons/fa'; // Importing search icon
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'; // Importing icons
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

    const getProfilePicture = (doctor) => {
        if (doctor.profile_picture && !doctor.profile_picture.startsWith('http')) {
            return `http://localhost:8000/storage/${doctor.profile_picture.replace('public/', '')}`;
        }
        return doctor.profile_picture || '/default-avatar.png';
    };

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

    const handleAppointmentSubmit = (e) => {
        e.preventDefault();
        alert(`Appointment requested with ${selectedDoctor.name} on ${selectedDate.toDateString()} at ${selectedTime}`);
    };

    return (
        <div className="doctor-page-container">
            <Navbar />

            <div className="doctor-page-content">
                {selectedDoctor ? (
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
        </div>
    );
};

export default DoctorsPage;
