import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ResumeChecker from './components/ResumeChecker';
import UserHistory from './components/UserHistory';

function App() {
  //  Persistent Dark Mode State
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    // Apply theme class to the body for global CSS targeting
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className="App">
        {/* Pass theme props to Navbar for the toggle switch */}
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} /> 
        
        <Routes>
          <Route path="/" element={<ResumeChecker />} />
          <Route path="/history" element={<UserHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;