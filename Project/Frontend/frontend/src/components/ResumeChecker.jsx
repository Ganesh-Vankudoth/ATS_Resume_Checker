import { useState } from "react";
import axios from "../axiosConfig";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../styles/ResumeChecker.css";

function ResumeChecker(){

const [file,setFile]=useState(null);
const [role,setRole]=useState("python_dev");
const [result,setResult]=useState(null);
const [loading,setLoading]=useState(false);

const handleUpload=async(e)=>{

e.preventDefault();

if(!file) return alert("Select a PDF!");

setLoading(true);
setResult(null);

const formData=new FormData();
formData.append("file",file);
formData.append("job_role",role);

try{

const response=await axios.post("/api/upload/",formData);
setResult(response.data.data);

}catch(error){

const errorMsg=error.response?.data?.error || "Upload failed";
alert(`Analysis Stopped: ${errorMsg}`);

}finally{
setLoading(false);
}

};

return(

<div className="checker-container">

<h1 className="page-title">AI Resume Analyzer</h1>
<p className="page-subtitle">
Upload your resume to evaluate ATS compatibility and receive AI insights
</p>

<div className="upload-card">

<form onSubmit={handleUpload} className="upload-form">

<input
type="file"
accept=".pdf"
onChange={(e)=>setFile(e.target.files[0])}
/>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
className="role-select"
>
<option value="python_dev">Python Developer</option>
<option value="frontend_dev">Frontend Developer</option>
<option value="backend_dev">Backend Developer</option>
<option value="fullstack_dev">Full Stack Developer</option>
<option value="data_analyst">Data Analyst</option>
<option value="devops_engine">DevOps Engineer</option>
</select>

<button type="submit" disabled={loading} className="primary-btn">
{loading ? "Analyzing..." : "Analyze Resume"}
</button>

</form>
</div>

{result && (

<div className="result-card">

<div className="score-section">

<div className="score-chart">
<CircularProgressbar
value={result.score}
text={`${result.score}%`}
styles={buildStyles({
pathColor:"#2563eb",
textColor:"#111",
trailColor:"#e5e7eb"
})}
/>
</div>

<h3>ATS Compatibility Score</h3>

</div>

<div className="analytics-grid">

<div className="metric-box">
<span className="metric-number">{result.features.skill_count}</span>
<span className="metric-label">Skills Detected</span>
</div>

<div className="metric-box">
<span className="metric-number">{result.features.project_count}</span>
<span className="metric-label">Projects</span>
</div>

<div className="metric-box">
<span className="metric-number">
{result.features.experience ? "Yes":"No"}
</span>
<span className="metric-label">Experience</span>
</div>

</div>

<h3 className="quality-text">
Resume Strength: {result.predicted_quality}
</h3>

<div className="skills-grid">

<div className="skill-column">
<h4>Matched Skills</h4>

<div className="skill-list">
{(result.matched_list || []).map((s,i)=>(
<span key={i} className="skill-badge matched">{s}</span>
))}
</div>
</div>

<div className="skill-column">
<h4>Missing Skills</h4>

<div className="skill-list">
{(result.missing_list || []).map((s,i)=>(
<span key={i} className="skill-badge missing">{s}</span>
))}
</div>
</div>

</div>

{result.suggestions && (

<div className="suggestion-box">

<h4>AI Suggestions</h4>

<ul>
{result.suggestions.map((s,i)=>(
<li key={i}>{s}</li>
))}
</ul>

</div>

)}

</div>

)}

</div>

);

}

export default ResumeChecker;