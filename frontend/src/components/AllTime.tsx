import { useState, useEffect } from 'react';
import { LogType } from '../LogType';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';


const AllTime = () => {
    useEffect(() => {
        const fetchLogs = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/my-logs/all`, { method: 'GET', credentials: 'include' });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLogs(data);
          } catch (error) {
            console.error('Error fetching logs:', error);
          }
        };
    
        fetchLogs();
      }, []);
    const [logs, setLogs] = useState<LogType[]>([]);
    const weightData = logs
    .filter(log => log.weight !== undefined)
    .map(log => ({
      date: log.logDate,
      weight: log.weight as number,
    }));
    const chartData = {
        labels: weightData.map(entry => entry.date),
        datasets: [
          {
            label: 'Weight (lbs)',
            data: weightData.map(entry => entry.weight),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      };
    
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'All Tracked Weights',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Weight (lbs)',
            },
            beginAtZero: true,
          },
        },
      };
    
      return <Line data={chartData} options={chartOptions} />;
};

export default AllTime;