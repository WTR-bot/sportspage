import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MyTeamsPage from './MyTeamsPage';
import NewsPage from './NewsPage';
import HomePage from './HomePage';

// Create a layout component with header and footer
function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-container">
          <h1>MySports Hub</h1>
          <nav>
            <ul>
              <li><Link to="/" className={isActive('/')}>Home</Link></li>
              <li><Link to="/news" className={isActive('/news')}>News</Link></li>
              <li><Link to="/myteams" className={isActive('/myteams')}>My Teams</Link></li>
              <li><Link to="/about" className={isActive('/about')}>About</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer>
        <div className="footer-content">
          <p>&copy; 2025 MySports Hub | Billy's Capstone Project</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// This is a placeholder for your About page
function AboutPage() {
  return (
    <div className="about-page">
      <h1>About MySports Hub</h1>
      <p>MySports Hub is a personalized dashboard for sports fans to track their favorite teams and stay updated with the latest sports news.</p>
      <div className="about-content">
        <h2>Our Mission</h2>
        <p>To provide sports enthusiasts with a customizable platform to follow their favorite teams and leagues all in one place.</p>
        
        <h2>Features</h2>
        <ul>
          <li>Personalized team tracking</li>
          <li>Real-time scores and game updates</li>
          <li>Curated sports news from various leagues</li>
          <li>Team statistics and performance analytics</li>
        </ul>
      </div>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/news" element={<Layout><NewsPage /></Layout>} />
        <Route path="/myteams" element={<Layout><MyTeamsPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        {/* Add routes for privacy, terms, contact, etc. */}
      </Routes>
    </Router>
  );
}

export default App;