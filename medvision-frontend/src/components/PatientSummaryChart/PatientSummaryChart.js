import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const PatientSummaryChart = ({ newPatients, oldPatients, totalPatients }) => {
  const data = {
    labels: ['New Patients', 'Old Patients', 'Total Patients'],
    datasets: [
      {
        data: [newPatients, oldPatients, totalPatients],
        backgroundColor: ['#01a29d', '#555', '#ccc'],
        hoverBackgroundColor: ['#019087', '#444', '#bbb'],
      },
    ],
  };

  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Doughnut data={data} />
    </div>
  );
};

export default PatientSummaryChart;
