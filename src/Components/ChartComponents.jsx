import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartComponent = ({ points }) => {
  const data = {
    labels: points.map((_, index) => `Game ${index + 1}`),
    datasets: [
      {
        label: 'Points Over Time',
        data: points,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Points Over Time',
      },
      filler: {
        propagate: true
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Games',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Points',
        },
        min: 0,
        max: 10000,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;
