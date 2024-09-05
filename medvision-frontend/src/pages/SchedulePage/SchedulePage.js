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

    const url = view === 'day' ? 'http://127.0.0.1:8000/api/appointments/today' : 'http://127.0.0.1:8000/api/appointments/week';
    
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setAppointments(response.data);
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
          style={{ height: 500 }}
          views={['day', 'week']}
          view={view} 
          onView={setView} 
          toolbar={false} 
        />
      </div>
    </div>
  );
};

export default SchedulePage;
