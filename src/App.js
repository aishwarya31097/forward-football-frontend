import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Radar, Doughnut } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { useDropzone } from 'react-dropzone';
import { Chart, registerables } from 'chart.js';
import Header from './components/Header';
import { Card, Button } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Chart.register(...registerables);

const App = () => {
  const [csvData, setCSVData] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [charts, setCharts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showHiddenCharts, setShowHiddenCharts] = useState(false);
  const [finalParams, setFinalparams] = useState([]);
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/data');
      setCSVData(response.data);
      setParameters(Object.keys(response.data[0]));
      generateCharts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpload = async (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      await axios.post('http://localhost:3001/upload', formData);
      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const generateCharts = (data) => {
    const finalparams = [];
    for (let i = 0; i < parameters.length; i++) {
      if (!['Player', 'Team', 'Position'].includes(parameters[i])) {
        finalparams.push(parameters[i]);
      }
    }
    setFinalparams(finalparams);
    const generatedCharts = () => (
      <div className="row">
        {finalparams.map((param, index) => {
          const chartType = getChartType(param);

          return (
            <div key={index} className="col-md-6 mb-4">
              <Card>
                <Card.Header className="text-center">{`${param}`}</Card.Header>
                <Card.Body>
                  <Card.Text className="text-center">
                    {renderChart(chartType, param, data)}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    );

    setCharts(generatedCharts);
  };

  const getChartType = (param) => {
    switch (param) {
      case 'Dribble Skills':
        return 'line';
      case 'Length':
        return 'bar';
      case 'Weight':
        return 'bar';
      case 'Age':
        return 'bar';
      case 'Ball Control':
        return 'bar';
      case 'Passing Under Pressure':
        return 'line';
      default:
        return 'bar';
    }
  };

  const renderChart = (chartType, param, data) => {
    const chartData = {
      labels: data.map((player) => player.Player),
      datasets: [
        {
          label: param,
          data: data.map((player) => player[param]),
          backgroundColor: 'red',
          border: '#e05b55',
        },
      ],
    };

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
  });

  const handleDownloadPDF = async () => {
    setShowHiddenCharts(true);
    setTimeout(() => {
      Download();
    }, 1000);
  };
  const Download = () => {
    const content = document.getElementById('hidden-charts');

    html2pdf(content, {
      margin: 10,
      filename: 'football_dashboard.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
    setShowHiddenCharts(false);
  };
  return (
    <div className={`main-container ${darkMode ? 'dark-mode' : ''}`}>
      <Header darkMode={darkMode} handleDarkModeToggle={handleDarkModeToggle} />
      <div id="charts-container" className="container mt-5">
        <div className="download">
          <CSVLink data={csvData} filename="football_data.csv">
            <button className="button">
              Download CSV
              <i
                className="bi bi-cloud-download"
                style={{ marginLeft: '5px' }}
              ></i>{' '}
            </button>
          </CSVLink>
          <button
            className="button"
            onClick={handleDownloadPDF}
            style={{ marginLeft: '10px' }}
          >
            Download PDF
            <i
              className="bi bi-cloud-download"
              style={{ marginLeft: '5px' }}
            ></i>{' '}
          </button>
        </div>

        <div {...getRootProps()} style={dropzoneStyle} className="mb-4">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop Excel file here</p>
          )}
        </div>
        <div id="chart-section">{charts}</div>
        {showHiddenCharts && (
          <div id="hidden-charts">
            {finalParams.map((param, index) => {
              const chartType = getChartType(param);
              return (
                <>
                  <div key={index} className="hidden-chart">
                    {renderChart(chartType, param, csvData)}
                  </div>
                  <div style={{ pageBreakAfter: 'always' }}></div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default App;
