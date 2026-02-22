import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">AI Resume Checker</div>
      <div className="nav-links">
        {/* 'Link' prevents the page from reloading, making it fast */}
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/history" className="nav-item">History</Link>
      </div>
    </nav>
  );
}

export default Navbar;