import { useState, useEffect } from 'react';
import { LogType } from '../LogType';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const WeekReport = () => {
  const [logs, setLogs] = useState<LogType[]>([]);

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

  const oneWeekAgo = new Date();
  oneWeekAgo.setHours(0,0,0,0);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weightData = logs
    .filter(log => log.weight !== undefined && new Date(log.logDate) >= oneWeekAgo)
    .map(log => ({
      date: log.logDate,
      weight: log.weight as number,
    }));

    const calData = logs
    .filter(log => log.currCal !== undefined && new Date(log.logDate) >= oneWeekAgo)
    .map(log => ({
      date: log.logDate,
      cal: log.currCal as number,
      goalcal: log.goalCal as number,
    }));

    
let regSlope: number = 0;
  const calculateLinearRegression = (data: { date: string; weight: number }[]) => {
    const n = data.length;
    const sumX = data.reduce((acc, curr, idx) => acc + idx, 0);
    const sumY = data.reduce((acc, curr) => acc + curr.weight, 0);
    const sumXY = data.reduce((acc, curr, idx) => acc + idx * curr.weight, 0);
    const sumXX = data.reduce((acc, curr, idx) => acc + idx * idx, 0);

    const slope: number = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    regSlope = slope;
    const intercept = (sumY - slope * sumX) / n;

    const regressionData = data.map((_, idx) => slope * idx + intercept);
    return regressionData;
  };


  const regressionData = calculateLinearRegression(weightData);

  const sum = calData.reduce((accum, curr) => accum + Number(curr.cal), 0);
  const avg = sum / calData.length;
  let total = avg;
  const adj = 400 * Number(regSlope);
  total = total - adj;

  const weightChartData = {
    labels: weightData.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: weightData.map(entry => entry.weight),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
      {
        label: 'Trend Line',
        data: regressionData,
        fill: false,
        borderColor: 'rgba(255,99,132,1)',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  const weightChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weight Over the Past Week',
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
  const calChartData = {
    labels: calData.map(entry => entry.date),
    datasets: [
      {
        label: 'Calories Consumed',
        data: calData.map(entry => entry.cal),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Goal Calories',
        data: calData.map(entry => entry.goalcal),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const calChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Calories vs. Goal Over the Past Week',
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
          text: 'Calories',
        },
        beginAtZero: true,
      },
    },
  };



  return (<div className='flex flex-col'>
        <Line data={weightChartData} options={weightChartOptions} />
        <Bar data={calChartData} options={calChartOptions} />
        <div className='rounded-md bg-gray-500 flex flex-col'>
            {regSlope ? <h1>Weight change rate: {regSlope}</h1> : <></>}
            {avg ? <h1>Average Daily Calorie Consumption: {avg}</h1> : <></>}
            {total ? <h1>Projected Baseline Calories: {total}</h1> : <></>}
        </div>
    </div>);
};

export default WeekReport;
