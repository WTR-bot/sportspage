import React, { useState } from 'react';

function MyTeamsPage() {
  // Sample data - will have to add an API
  const [favoriteTeams, setFavoriteTeams] = useState([
    { id: 1, name: "Lakers", league: "NBA", score: "108-102", opponent: "Warriors", status: "Final", logo: "/api/placeholder/60/60" },
    { id: 2, name: "Chiefs", league: "NFL", score: "24-17", opponent: "Ravens", status: "Final", logo: "/api/placeholder/60/60" },
    { id: 3, name: "Yankees", league: "MLB", score: "5-3", opponent: "Red Sox", status: "7th Inning", logo: "/api/placeholder/60/60" },
    { id: 4, name: "Real Madrid", league: "La Liga", score: "2-1", opponent: "Barcelona", status: "85'", logo: "/api/placeholder/60/60" }
  ]);
  
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    league: '',
    opponent: '',
    status: 'Upcoming',
    score: '0-0',
    logo: "/api/placeholder/60/60"
  });
  
  const leagues = ["NBA", "NFL", "MLB", "NHL", "La Liga", "Premier League", "Bundesliga", "Serie A"];
  
  const handleAddTeam = () => {
    if (newTeam.name && newTeam.league && newTeam.opponent) {
      setFavoriteTeams([...favoriteTeams, {
        id: favoriteTeams.length + 1,
        ...newTeam
      }]);
      
      setNewTeam({
        name: '',
        league: '',
        opponent: '',
        status: 'Upcoming',
        score: '0-0',
        logo: "/api/placeholder/60/60"
      });
      
      setShowAddTeamModal(false);
    }
  };
  
  const handleRemoveTeam = (id) => {
    setFavoriteTeams(favoriteTeams.filter(team => team.id !== id));
  };
  
  return (
    <div className="my-teams-page">
      <div className="page-header">
        <h1>My Teams</h1>
        <button 
          className="add-team-btn" 
          onClick={() => setShowAddTeamModal(true)}
        >
          + Add Team
        </button>
      </div>
      
      <div className="teams-filter">
        <span>Filter by:</span>
        <select className="filter-dropdown">
          <option value="all">All Leagues</option>
          {leagues.map(league => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>
        <select className="filter-dropdown">
          <option value="all">All Statuses</option>
          <option value="live">Live Games</option>
          <option value="upcoming">Upcoming</option>
          <option value="final">Final</option>
        </select>
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
              <button 
                className="remove-btn" 
                onClick={() => handleRemoveTeam(team.id)}
                aria-label="Remove team"
              >
                ×
              </button>
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
        <div 
          className="team-card add-team-card"
          onClick={() => setShowAddTeamModal(true)}
        >
          <div className="add-icon">+</div>
          <p>Add another favorite team</p>
        </div>
      </div>
      
      {showAddTeamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add a New Team</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowAddTeamModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="teamName">Team Name:</label>
                <input
                  id="teamName"
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  placeholder="e.g. Lakers"
                />
              </div>
              <div className="form-group">
                <label htmlFor="teamLeague">League:</label>
                <select
                  id="teamLeague"
                  value={newTeam.league}
                  onChange={(e) => setNewTeam({...newTeam, league: e.target.value})}
                >
                  <option value="">Select a league</option>
                  {leagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="teamOpponent">Next Opponent:</label>
                <input
                  id="teamOpponent"
                  type="text"
                  value={newTeam.opponent}
                  onChange={(e) => setNewTeam({...newTeam, opponent: e.target.value})}
                  placeholder="e.g. Warriors"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddTeamModal(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleAddTeam}
              >
                Add Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTeamsPage;