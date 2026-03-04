import { useState } from 'react';
import axios from '../axiosConfig';
import '../styles/Auth.css';

function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'job_seeker'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // 🔐 JWT LOGIN
                const res = await axios.post('/api/token/', {
                    username: form.username,
                    password: form.password
                });

                // Store tokens
                localStorage.setItem('access', res.data.access);
                localStorage.setItem('refresh', res.data.refresh);

                // Store user info
                localStorage.setItem('user', JSON.stringify({
                    username: form.username
                }));

                setUser({ username: form.username });

            } else {
                // 📝 REGISTER
                await axios.post('/api/register/', {
                    username: form.username,
                    password: form.password,
                    role: form.role
                });

                alert("Registration Successful! Please Login.");
                setIsLogin(true);
            }

        } catch (err) {
            alert("Error: " + (err.response?.data?.detail || "Login failed"));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Join us to start analyzing your resumes'}
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="e.g. ganesh_2026"
                            value={form.username}
                            onChange={e =>
                                setForm({ ...form, username: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e =>
                                setForm({ ...form, password: e.target.value })
                            }
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label>I am a...</label>
                            <select
                                className="role-select"
                                value={form.role}
                                onChange={e =>
                                    setForm({ ...form, role: e.target.value })
                                }
                            >
                                <option value="job_seeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn-active">
                        {isLogin ? 'Sign In' : 'Get Started'}
                    </button>
                </form>

                <p
                    className="auth-toggle-text"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin
                        ? "New here? Create an account"
                        : "Already have an account? Log in"}
                </p>
            </div>
        </div>
    );
}

export default Auth;