import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const LogsDisplay = () => {
  const [logs, setLogs] = useState([]);

  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  useEffect(() => {
    const fetchLogs = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/my-logs/all`, {
            method: "GET",
            credentials: "include",
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          setLogs(data);
        } catch (error) {
          console.error('Error fetching logs:', error.message);
        }
      };

    fetchLogs();
  }, []);

  const handleLogClick = (logDate) => {
    navigate(`/add-log/${logDate}`);
  };
    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Logs</h1>
          {logs.length === 0 ? (
            <p className="text-gray-600">No logs available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {logs.map((log) => (
                <div 
                  key={log._id} 
                  className="p-4 border border-gray-200 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                  onClick={() => handleLogClick(log.logDate)}
                >
                  <h2 className="text-lg font-semibold mb-2">{formatDate(log.logDate)}</h2>
                  <p><strong>Weight:</strong> {log.weight} lbs</p>
                  <p><strong>Total Calories:</strong> {log.currCal} kcal</p>
                  <p><strong>Goal Calories:</strong> {log.goalCal} kcal</p>
                  <p><strong>+- Calories:</strong> {log.currCal - log.currCal} kcal</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
};

export default LogsDisplay;