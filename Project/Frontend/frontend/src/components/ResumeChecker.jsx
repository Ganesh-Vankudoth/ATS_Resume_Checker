import { useState } from "react";
import axios from 'axios';
import FirstAppStatus from "./FirstAppStatus"; // Importing the separate component

function App() {
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('python_dev');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a PDF!");

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_role', role);

        try {
            // Calls path('', include('resume.urls')) -> path('api/upload/')
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
            setResult(response.data);
        } catch (error) {
            alert("Analysis failed. Check backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
            <FirstAppStatus /> {/* Clean, separate component for testing */}
            
            <h1>AI Resume Checker</h1>
            
            <form onSubmit={handleUpload} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf" />
                <br /><br />
                
                <label>Target Role: </label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="python_dev">Python Developer</option>
                    <option value="frontend_dev">Frontend Developer</option>
                    <option value="data_analyst">Data Analyst</option>
                    <option value="backend_dev">Backend Developer</option>
                </select>
                <br /><br />
                
                <button type="submit" disabled={loading}>
                    {loading ? "Analyzing..." : "Check Score"}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #28a745', borderRadius: '8px' }}>
                    <h2>Result: {result.score}%</h2>
                    <p><strong>Matched:</strong> {result.found?.join(', ')}</p>
                    <p style={{ color: '#d9534f' }}><strong>Missing:</strong> {result.missing?.join(', ')}</p>
                </div>
            )}
        </div>
    );
}

export default App;