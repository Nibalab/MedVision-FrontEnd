import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const DoctorSummaryChart = ({ newDoctors, oldDoctors, totalDoctors }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['New Doctors', 'Old Doctors', 'Total Doctors'],
          datasets: [
            {
              data: [newDoctors, oldDoctors, totalDoctors],
              backgroundColor: ['#01a29d', '#555', '#ccc'], 
              hoverBackgroundColor: ['#01a29d', '#555', '#ccc'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });

      // Cleanup function to destroy the chart instance before reusing the canvas
      return () => {
        chart.destroy();
      };
    }
  }, [newDoctors, oldDoctors, totalDoctors]);

  return <canvas ref={chartRef} />;
};

export default DoctorSummaryChart;
