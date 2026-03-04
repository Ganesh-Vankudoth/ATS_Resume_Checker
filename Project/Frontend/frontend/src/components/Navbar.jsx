import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import '../styles/Navbar.css';

function Navbar({ user, handleLogout, darkMode, toggleTheme }) {
  const navigate = useNavigate();


  return (
    <nav className="navbar">
      <div className="nav-logo">AI Resume Checker</div>
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        
        {user ? (
          <>
            <Link to="/history" className="nav-item">History</Link>
            <span className="user-badge">👤 {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/" className="nav-item">Login</Link>
        )}

        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;