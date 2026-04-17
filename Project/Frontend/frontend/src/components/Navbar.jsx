
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ user, handleLogout}) {
  return (
    <nav className="navbar">

      {/* LEFT (empty for balance) */}
      <div className="nav-left"></div>

      {/* CENTER TITLE */}
      <div className="nav-center">
        <span className="nav-logo"> Resume Analyzer</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        <Link to="/" className="nav-item">Home</Link>
        <Link to="/history" className="nav-item">History</Link>

        <div className="user-badge">
          👤 {user.username}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

     

      </div>

    </nav>
  );
}

export default Navbar;