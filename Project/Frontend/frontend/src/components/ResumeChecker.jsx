import { useState } from "react";
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/Dashboard.css';

function ResumeChecker() {
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('python_dev');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Select a PDF!");
        
        setLoading(true); // Start spinning
        setResult(null);  // Clear previous results to refresh the UI

        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_role', role);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
            setResult(response.data);
        } catch (error) {
            //  Extracting backend error messages
            const errorMsg = error.response?.data?.error || "Analysis failed.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            {/* Professional Upload Card */}
            <div className="upload-card">
                <form onSubmit={handleUpload} className="upload-form">
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        accept=".pdf" 
                    />
                    
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
                        <option value="python_dev">Python Developer</option>
                        <option value="frontend_dev">Frontend Developer</option>
                        <option value="data_analyst">Data Analyst</option>
                        <option value="backend_dev">Backend Developer</option>
                        <option value="fullstack_dev">Full Stack Developer</option>
                        <option value="devops_engine">DevOps Engineer</option>
                        <option value="java_dev">Java Developer</option>
                    </select>

                    <button type="submit" disabled={loading} className={loading ? "btn-disabled" : "btn-active"}>
                        {loading ? <div className="spinner"></div> : "Check Score"}
                    </button>
                </form>
            </div>

            {/*  Visual Results Display */}
            {result && (
                <div className="result-card">
                    <div className="score-viz">
                        <div style={{ width: 160, height: 160, margin: '0 auto' }}>
                            <CircularProgressbar 
                                value={result.score} 
                                text={`${result.score}%`} 
                                styles={buildStyles({
                                    pathColor: result.score > 70 ? '#28a745' : '#ffc107',
                                    textColor: '#333',
                                    trailColor: '#eee',
                                    strokeLinecap: 'round',
                                    textSize: '18px'
                                })}
                            />
                        </div>
                        <h3>ATS Compatibility Match</h3>
                    </div>
                    
                    <div className="skills-grid">
                        <div className="skill-column">
                            <h4 className="section-title matched">✅ Matched Skills</h4>
                            <div className="skill-list">
                                {/* Safety check: use '|| []' to prevent .map() from crashing if result is empty */}
                                {(result.found || []).map((skill, i) => (
                                    <span key={i} className="skill-badge matched">{skill}</span>
                                ))}
                                {result.found?.length === 0 && <p className="no-data">No keywords matched.</p>}
                            </div>
                        </div>

                        <div className="skill-column">
                            <h4 className="section-title missing">❌ Missing Keywords</h4>
                            <div className="skill-list">
                                {/* Safety check for missing skills list */}
                                {(result.missing || []).map((skill, i) => (
                                    <span key={i} className="skill-badge missing">{skill}</span>
                                ))}
                                {result.missing?.length === 0 && <p className="no-data">Your resume is fully optimized!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResumeChecker;