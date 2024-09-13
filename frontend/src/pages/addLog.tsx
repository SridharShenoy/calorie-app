import ManageLogForm from "../forms/logForm/ManageLogForm";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import USDAFoodSearch from "../components/Search";
import { useNavigate } from 'react-router-dom';
type logType = {
    _id: string;
    goalCal: number;
    currCal: number;
    logItems: { name: string; calories: number }[];
    logDate: string;
    journalEntry: string;
    weight: number;
    userId: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const AddLog = () => {
    const navigate = useNavigate();
    const { date } = useParams<{ date: string }>();
    const [log, setLog] = useState<logType | undefined>(undefined);

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
        } catch (error) {
            console.error('Error saving log:', error);
        }
    };
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
                } else if (response.status === 404) {
                    console.log('No log found for this date:', date);
                    navigate('/404');
                } else {
                    console.error('Failed to fetch log:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching log:', error);
            }
            };

    useEffect(() => {
        fetchLog();
    }, []);
    return (
        <div className="flex">
            <ManageLogForm date={date || ''} onSave={saveMyLog} log={log} />
            <div className="rounded-md border m-auto p-10">
                <USDAFoodSearch />
            </div>
        </div>
    );
};

export default AddLog;
