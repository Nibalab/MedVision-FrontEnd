import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import './SchedulePage.css'; 
import Sidebar from '../../components/Sidebar/Sidebar'; 

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState('day'); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = view === 'day' ? 'http://localhost:8000/api/appointments/today' : 'http://localhost:8000/api/appointments/week';

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const formattedAppointments = response.data.map(appointment => {
        const startDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 
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

        {view === 'day' && <h2>{moment().format('dddd, MMMM Do')}</h2>}

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
