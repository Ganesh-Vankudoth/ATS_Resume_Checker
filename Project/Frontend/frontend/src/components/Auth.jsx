import { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', password: '', role: 'job_seeker' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'login/' : 'register/';
        try {
            const res = await axios.post(`http://127.0.0.1:8000/api/${url}`, form);
            if (isLogin) {
                setUser(res.data); // Save user to App state
                localStorage.setItem('user', JSON.stringify(res.data));
            } else {
                alert("Registered! Please login.");
                setIsLogin(true);
            }
        } catch (err) { alert("Auth failed: " + (err.response?.data?.error || "Error")); }
    };

    return (
        <div className="main-container">
            <div className="upload-card" style={{ maxWidth: '400px', margin: 'auto' }}>
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                <form onSubmit={handleSubmit} style={{ flexDirection: 'column' }}>
                    <input type="text" placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} required />
                    <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
                    {!isLogin && (
                        <select onChange={e => setForm({...form, role: e.target.value})}>
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    )}
                    <button type="submit" className="btn-active">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', marginTop: '10px', color: '#007bff' }}>
                    {isLogin ? "Need an account? Register" : "Have an account? Login"}
                </p>
            </div>
        </div>
    );
}
export default Auth;