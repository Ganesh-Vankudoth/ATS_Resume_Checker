import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumeChecker from './components/ResumeChecker';
import UserHistory from './components/UserHistory';
import Auth from './components/Auth'; 
import axios from 'axios';

function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Auth State - Retrieve user from localStorage if they already logged in
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Logout Logic
  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout/');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <Router>
      <div className="App">
        {/* Only show Navbar if user is logged in */}
        {user && (
          <Navbar 
            user={user} 
            handleLogout={handleLogout} 
            darkMode={darkMode} 
            toggleTheme={toggleTheme} 
          />
        )}
        
        <Routes>
          {/*  Public Route for Login/Register */}
          <Route 
            path="/auth" 
            element={!user ? <Auth setUser={setUser} /> : <Navigate to="/" />} 
          />

          {/* Protected Routes - Redirect to /auth if not logged in */}
          <Route 
            path="/" 
            element={user ? <ResumeChecker /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/history" 
            element={user ? <UserHistory /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;