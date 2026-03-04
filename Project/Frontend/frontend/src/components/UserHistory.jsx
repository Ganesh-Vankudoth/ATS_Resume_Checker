import { useEffect, useState } from "react";
import axios from '../axiosConfig';
import '../styles/UserHistory.css';

function UserHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
useEffect(() => {
    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/history/', {
                withCredentials: true // 👈 MANDATORY: This sends the session cookie to Django
            });
            setHistory(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
            // Don't alert on 401/403 (unauthorized), just redirect to login
            if (error.response?.status === 401) {
                console.log("User not logged in");
            } else {
                alert("Failed to load History.");
            }
        } finally {
            setLoading(false);
        }
    };
    fetchHistory();
}, []);
    // Logic to filter the history list in real-time
    const filteredHistory = history.filter((item) => {
        const keywordsString = item.matched_list ? item.matched_list.join(", ") : "";
        const matchesSearch = keywordsString.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || item.job_role_display === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="spinner-container">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="history-container">
            <h2>Your Analysis History</h2>

            {/* Search and Filter Bar */}
            <div className="filter-bar">
                <input 
                    type="text" 
                    placeholder="Search keywords (e.g. Python, React)..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select 
                    className="filter-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="Python Developer">Python Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                </select>
            </div>

            {filteredHistory.length === 0 ? (
                <p className="no-results">No matching analysis found.</p>
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
                        {filteredHistory.map((item) => (
                            <tr key={item.id}>
                               <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td>{item.job_role_display}</td>
                                <td className={item.score > 70 ? "high-score" : "low-score"}>
                                    {item.score}%
                                </td>
                                <td>{item.matched_list && item.matched_list.length > 0 ? item.matched_list.join(", ") : "None"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserHistory;