import React from 'react';
import { PolarArea } from 'react-chartjs-2';

const RadarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100, // Adjust as needed
      },
    },
  };

  return <PolarArea data={chartData} options={chartOptions} />;
};

export default RadarChart;
