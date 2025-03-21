import './App.css';
import React, { useState } from 'react';

function App() {
  // Sample data - will have to add an API
  const [favoriteTeams, setFavoriteTeams] = useState([
    { id: 1, name: "Lakers", league: "NBA", score: "108-102", opponent: "Warriors", status: "Final", logo: "/api/placeholder/60/60" },
    { id: 2, name: "Chiefs", league: "NFL", score: "24-17", opponent: "Ravens", status: "Final", logo: "/api/placeholder/60/60" },
    { id: 3, name: "Yankees", league: "MLB", score: "5-3", opponent: "Red Sox", status: "7th Inning", logo: "/api/placeholder/60/60" },
    { id: 4, name: "Real Madrid", league: "La Liga", score: "2-1", opponent: "Barcelona", status: "85'", logo: "/api/placeholder/60/60" }
  ]);

  // Sample news data
  const latestNews = [
    { id: 1, headline: "Trade deadline approaches: Which teams are making moves?", category: "General" },
    { id: 2, headline: "MVP race heats up as playoffs approach", category: "NBA" },
    { id: 3, headline: "Draft day predictions: Top picks analysis", category: "NFL" }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-container">
          <h1>MySports Hub</h1>
          <nav>
            <ul>
              <li><a href="#home" className="active">Home</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#myTeams">My Teams</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <section className="welcome-banner">
          <h2>Welcome to MySports Hub</h2>
          <p>Your personalized dashboard for all your favorite teams and sports news</p>
        </section>
        
        <section className="my-teams-section">
          <div className="section-header">
            <h2>My Teams</h2>
            <button className="add-team-btn">+ Add Team</button>
          </div>
          
          <div className="teams-grid">
            {favoriteTeams.map(team => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <img src={team.logo} alt={`${team.name} logo`} className="team-logo" />
                  <div className="team-info">
                    <h3>{team.name}</h3>
                    <span className="league-tag">{team.league}</span>
                  </div>
                </div>
                <div className="score-container">
                  <div className="matchup">
                    <span className="team-name">vs {team.opponent}</span>
                    <span className="game-status">{team.status}</span>
                  </div>
                  <div className="score">{team.score}</div>
                </div>
                <div className="card-actions">
                  <button className="action-btn">Stats</button>
                  <button className="action-btn">Upcoming</button>
                </div>
              </div>
            ))}
            <div className="team-card add-team-card">
              <div className="add-icon">+</div>
              <p>Add another favorite team</p>
            </div>
          </div>
        </section>
        
        <section className="news-section">
          <div className="section-header">
            <h2>Latest News</h2>
            <a href="#news" className="view-all">View All</a>
          </div>
          
          <div className="news-container">
            {latestNews.map(item => (
              <div key={item.id} className="news-card">
                <span className="news-category">{item.category}</span>
                <h3>{item.headline}</h3>
                <a href={`#news/${item.id}`} className="read-more">Read More</a>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer>
        <div className="footer-content">
          <p>&copy; 2025 MySports Hub | Billy's Capstone Project</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;