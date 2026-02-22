import { useState } from "react";
import axios from 'axios';
import '../styles/Dashboard.css'; 

function ResumeChecker() {
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('python_dev');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Select a PDF!");
        setLoading(true);
        
        setLoading(true); //start spinning
        setResult(null);  // clear previous results


        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_role', role);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
            setResult(response.data);
        } catch (error) {
            alert("Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-container">
            <form onSubmit={handleUpload}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf" />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
                    <option value="python_dev">Python Developer</option>
                    <option value="frontend_dev">Frontend Developer</option>
                    <option value="data_analyst">Data Analyst</option>
                    <option value="backend_dev">Backend Developer</option>
                    <option value="fullstack_dev">Full Stack Developer</option>
                    <option value="devops_engine">DevOps Engineer</option>
                    <option value="java_dev">Java Developer</option>
                </select>
                {/* Spinner logic for the button */}
                <button type="submit" disabled={loading} className={loading ? "btn-disabled" : ""}>
                    {loading ? <div className="spinner"></div> : "Check Score"}
                </button>

            </form>

            {result && (
                <div className="result-card">
                    <h2 className={`score-text ${result.score > 70 ? 'high-score' : 'low-score'}`}>
                        ATS Match Score: {result.score}%
                    </h2>
                    
                    <div className="skills-grid">
                        <div className="skill-column">
                            <h4 style={{ color: '#28a745' }}>✅ Matched Skills</h4>
                            {result.found.map((skill, i) => (
                                <li key={i} className="skill-item matched">{skill}</li>
                            ))}
                        </div>

                        <div className="skill-column">
                            <h4 style={{ color: '#d9534f' }}>❌ Missing Keywords</h4>
                            {result.missing.map((skill, i) => (
                                <li key={i} className="skill-item missing">{skill}</li>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResumeChecker;