import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import './SchedulePage.css'; 
import Sidebar from '../../components/Sidebar/Sidebar'; // Assuming you have this component

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState('day'); // Manage the view, 'day' or 'week'

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = view === 'day' ? 'http://localhost:8000/api/appointments/today' : 'http://localhost:8000/api/appointments/week';

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      // Map response to the format expected by the Calendar
      const formattedAppointments = response.data.map(appointment => {
        const startDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assuming each appointment is 1 hour
        return {
          id: appointment.id,
          title: `Appointment with Patient ${appointment.patient_id}`,
          start: startDate,
          end: endDate,
          status: appointment.status,
        };
      });
      setAppointments(formattedAppointments);
    })
    .catch(error => console.error('Error fetching appointments', error));
  }, [view]);

  return (
    <div className="schedule-page-container">
      <Sidebar />
      <div className="main-content">
        {/* View toggle buttons */}
        <div className="view-toggle">
          <button
            className={`toggle-button ${view === 'day' ? 'active' : ''}`}
            onClick={() => setView('day')}
          >
            Daily
          </button>
          <button
            className={`toggle-button ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            Weekly
          </button>
        </div>

        {/* Display today's date if in daily view */}
        {view === 'day' && <h2>{moment().format('dddd, MMMM Do')}</h2>}

        {/* Calendar Component */}
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 570 }}
          views={['day', 'week']}
          view={view}
          onView={setView}
        />
      </div>
    </div>
  );
};

export default SchedulePage;
