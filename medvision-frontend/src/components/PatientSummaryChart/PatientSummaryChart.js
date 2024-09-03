import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const PatientSummaryChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['New Patient', 'Old Patient', 'Total Patient'],
    datasets: [
      {
        label: 'Patient Summary',
        data: [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://127.0.0.1:8000/api/doctor-dashboard/patient-summary', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const data = response.data;
      setChartData({
        labels: ['New Patient', 'Old Patient', 'Total Patient'],
        datasets: [
          {
            label: 'Patient Summary',
            data: [data.newPatients, data.oldPatients, data.totalPatients],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      });
    })
    .catch(error => {
      console.error('Error fetching patient summary data:', error);
    });
  }, []);

  return (
    <div>
      <h3>Patient Summary Jan 2024</h3>
      <Doughnut data={chartData} />
    </div>
  );
};

export default PatientSummaryChart;
