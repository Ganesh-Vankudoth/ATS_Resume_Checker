import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import Navbar from './components/Navbar';
import ResumeChecker from './components/ResumeChecker';
import UserHistory from './components/UserHistory';
import Auth from './components/Auth'; 

// Style Imports
import './styles/Global.css'; 

function App() {
  // --- 1. THEME STATE ---
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // --- 2. AUTH STATE ---
  // We check localStorage immediately so the user doesn't see a "flicker" of the login page
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- 3. THEME SIDE EFFECT ---
  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // --- 4. LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
};

  return (
    <Router>
      {/* The "App" class applies your global CSS. 
        The "dark-mode" class applies your Day 14 theme colors.
      */}
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        
        {/* NAVBAR STRATEGY: 
          We only show the Navbar if a user is logged in. 
          This makes the Login/Register page look like a clean, standalone "Portal".
        */}
        {user && (
          <Navbar 
            user={user} 
            handleLogout={handleLogout} 
            darkMode={darkMode} 
            toggleTheme={toggleTheme} 
          />
        )}
        
        {/* MAIN CONTENT AREA */}
        <main className="content-container">
          <Routes>
            {/* AUTH ROUTE:
              If NOT logged in -> Show Login/Register.
              If already logged in -> Don't show Login, redirect to Dashboard (/).
            */}
            <Route 
              path="/auth" 
              element={!user ? <Auth setUser={setUser} /> : <Navigate to="/" />} 
            />

            {/* DASHBOARD ROUTE (Home):
              If logged in -> Show the Resume Checker.
              If NOT logged in -> Redirect to /auth.
            */}
            <Route 
              path="/" 
              element={user ? <ResumeChecker /> : <Navigate to="/auth" />} 
            />

            {/* HISTORY ROUTE:
              Protected by the same logic. 
            */}
            <Route 
              path="/history" 
              element={user ? <UserHistory /> : <Navigate to="/auth" />} 
            />

            {/* SECURITY / CATCH-ALL:
              If the user types a wrong URL, this sends them back to the start.
            */}
            <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
          </Routes>
        </main>

        {/* You can add a Footer here if you have one */}
      </div>
    </Router>
  );
}

export default App;