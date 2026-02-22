import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ darkMode, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-logo">AI Resume Checker</div>
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/history" className="nav-item">History</Link>
        
        {/* Day 14: Theme Toggle Button */}
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;