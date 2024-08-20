import ManageLogForm from "../forms/logForm/ManageLogForm";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import USDAFoodSearch from "../components/Search";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const AddLog = () => {
    const { date } = useParams();
    const [log, setLog] = useState(null);

    const saveMyLog = async (LogFormData: FormData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my-logs/save/${date}`, {
                method: "POST",
                credentials: "include",
                body: LogFormData,
            });

            if (!response.ok) {
                throw new Error("Failed to save log");
            }
            console.log("Log saved successfully");
        } catch (error) {
            console.error('Error saving log:', error);
        }
    };

    useEffect(() => {
      const fetchLog = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my-logs/get-log/${date}`, {
              method: "POST",
              credentials: "include",
            }
            );
            if (response.ok) {
                const data = await response.json();
                setLog(data);
                console.log('Log has been fetched:', data);
            } else if (response.status === 404) {
                console.log('No log found for this date:', date);
            } else {
                console.error('Failed to fetch log:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching log:', error);
        }
      };

        fetchLog();
    }, [date]);

    return (
        <div className="flex">
            <ManageLogForm date={date} onSave={saveMyLog} log={log} />
            <div className="rounded-md border m-auto p-10">
                <USDAFoodSearch />
            </div>
        </div>
    );
};

export default AddLog;
