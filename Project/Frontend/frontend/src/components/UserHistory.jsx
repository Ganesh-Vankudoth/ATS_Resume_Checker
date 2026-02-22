import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Dashboard.css';

function UserHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/history/');
                setHistory(response.data);
            } catch (error) {
                console.error("Fetch error:", error);
                alert("Failed to load History.");
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []); 
    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <h2>Your Analysis History</h2>
            {history.length === 0 ? (
                <p>No past analysis found. Upload a resume to get started!</p>
            ) : (
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Job Role</th>
                            <th>Score</th>
                            <th>Keywords Matched</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item) => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.job_role}</td>
                                <td className={item.score > 70 ? "high-score" : "low-score"}>
                                    {item.score}%
                                </td>
                                <td>{item.matched || "None"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserHistory;