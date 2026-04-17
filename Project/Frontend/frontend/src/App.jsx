import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Navbar from './components/Navbar';
import ResumeChecker from './components/ResumeChecker';
import UserHistory from './components/UserHistory';
import Auth from './components/Auth'; 

// Style Imports
import './styles/Global.css'; 

function App() {



  // 🔐 AUTH STATE
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <div className="App">

        {/* 🧭 NAVBAR (ONLY IF LOGGED IN) */}
        {user && (
          <Navbar 
            user={user} 
            handleLogout={handleLogout} 
            
          />
        )}

        {/* 📦 MAIN CONTENT AREA */}
        <main className="content-container">
          <Routes>

            {/* 🔐 AUTH PAGE */}
            <Route 
              path="/auth" 
              element={
                !user 
                  ? <Auth setUser={setUser} /> 
                  : <Navigate to="/" />
              } 
            />

            {/* 🏠 HOME / DASHBOARD */}
            <Route 
              path="/" 
              element={
                user 
                  ? <ResumeChecker /> 
                  : <Navigate to="/auth" />
              } 
            />

            {/* 📊 HISTORY */}
            <Route 
              path="/history" 
              element={
                user 
                  ? <UserHistory /> 
                  : <Navigate to="/auth" />
              } 
            />

            {/* 🔁 FALLBACK */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/" : "/auth"} />} 
            />

          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;