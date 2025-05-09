import React, { useState, useEffect } from 'react';

function MyTeamsPage() {
  const [favoriteTeams, setFavoriteTeams] = useState([
    { id: 1, name: "Lakers", league: "NBA", score: "0-0", opponent: "Warriors", status: "Upcoming", logo: "/api/placeholder/60/60" },
    { id: 2, name: "Celtics", league: "NBA", score: "0-0", opponent: "Heat", status: "Upcoming", logo: "/api/placeholder/60/60" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for adding teams
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('NBA');
  const [searchResults, setSearchResults] = useState([]);
  const [allTeams, setAllTeams] = useState({});
  const [searching, setSearching] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Available leagues with their API paths
  const availableLeagues = [
    { id: 'NBA', name: 'NBA Basketball', apiPath: 'basketball/nba' },
    { id: 'WNBA', name: 'WNBA Basketball', apiPath: 'basketball/wnba' },
    { id: 'MLB', name: 'MLB Baseball', apiPath: 'baseball/mlb' },
    { id: 'NFL', name: 'NFL Football', apiPath: 'football/nfl' },
    { id: 'NHL', name: 'NHL Hockey', apiPath: 'hockey/nhl' },
    { id: 'EPL', name: 'Premier League Soccer', apiPath: 'soccer/eng.1' }
  ];

  // Fetch scores for favorite teams
  useEffect(() => {
    const fetchScores = async () => {
      if (favoriteTeams.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Group teams by league to minimize API calls
        const teamsByLeague = favoriteTeams.reduce((acc, team) => {
          if (!acc[team.league]) acc[team.league] = [];
          acc[team.league].push(team);
          return acc;
        }, {});

        const leaguePromises = Object.entries(teamsByLeague).map(async ([league, teams]) => {
          const leagueData = availableLeagues.find(l => l.id === league);
          if (!leagueData) return teams; // Return unchanged if league not found

          const apiPath = leagueData.apiPath;
          const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${apiPath}/scoreboard`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch scores for ${league}`);
          }
          
          const data = await response.json();
          
          // Update each team with its current game data
          return teams.map(team => {
            const game = data.events.find(event =>
              event.competitions[0].competitors.some(competitor => 
                competitor.team.shortDisplayName === team.name || 
                competitor.team.name === team.name)
            );

            if (game) {
              const teamData = game.competitions[0].competitors.find(
                competitor => competitor.team.shortDisplayName === team.name || competitor.team.name === team.name
              );
              
              const opponentData = game.competitions[0].competitors.find(
                competitor => competitor.team.shortDisplayName !== team.name && competitor.team.name !== team.name
              );

              return {
                ...team,
                score: `${teamData.score || 0} - ${opponentData.score || 0}`,
                opponent: opponentData.team.shortDisplayName || opponentData.team.name,
                status: game.status.type.shortDetail,
                logo: teamData.team.logo || team.logo,
              };
            }

            return team;
          });
        });

        const updatedTeamsByLeague = await Promise.all(leaguePromises);
        const updatedTeams = updatedTeamsByLeague.flat();
        
        setFavoriteTeams(updatedTeams);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  // Fetch teams for the selected league
  useEffect(() => {
    const fetchTeams = async () => {
      // Skip if we already have the teams for this league
      if (allTeams[selectedLeague]) {
        return;
      }
      
      setLoadingTeams(true);
      
      try {
        const leagueData = availableLeagues.find(l => l.id === selectedLeague);
        if (!leagueData) {
          throw new Error(`League data not found for ${selectedLeague}`);
        }
        
        const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${leagueData.apiPath}/teams`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const data = await response.json();
        
        // Process teams data
        const teamsData = data.sports[0].leagues[0].teams.map(team => ({
          id: team.team.id,
          name: team.team.displayName,
          shortName: team.team.shortDisplayName || team.team.name,
          logo: team.team.logos?.[0]?.href || '/api/placeholder/60/60'
        }));
        
        setAllTeams(prevTeams => ({
          ...prevTeams,
          [selectedLeague]: teamsData
        }));
        
      } catch (err) {
        console.error('Error fetching teams:', err);
      } finally {
        setLoadingTeams(false);
      }
    };
    
    fetchTeams();
  }, [selectedLeague]);

  // Handle searching for teams
  const handleSearch = () => {
    setSearching(true);
    
    if (allTeams[selectedLeague]) {
      const filteredTeams = allTeams[selectedLeague].filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredTeams);
      setSearching(false);
    } else {
      // If teams haven't been loaded yet
      setSearchResults([]);
      setSearching(false);
    }
  };

  // Handle team selection
  const handleAddTeam = (team) => {
    // Check if team is already added
    const isAlreadyAdded = favoriteTeams.some(
      favTeam => favTeam.id === team.id && favTeam.league === selectedLeague
    );
    
    if (!isAlreadyAdded) {
      const newTeam = {
        id: team.id,
        name: team.shortName,
        league: selectedLeague,
        score: "0-0",
        opponent: "TBD",
        status: "No games scheduled",
        logo: team.logo
      };
      
      setFavoriteTeams([...favoriteTeams, newTeam]);
      
      // Immediately fetch scores for the new team
      const leagueData = availableLeagues.find(l => l.id === selectedLeague);
      if (leagueData) {
        fetch(`https://site.api.espn.com/apis/site/v2/sports/${leagueData.apiPath}/scoreboard`)
          .then(res => res.json())
          .then(data => {
            const game = data.events.find(event =>
              event.competitions[0].competitors.some(competitor => 
                competitor.team.id === team.id)
            );
            
            if (game) {
              const teamData = game.competitions[0].competitors.find(
                competitor => competitor.team.id === team.id
              );
              
              const opponentData = game.competitions[0].competitors.find(
                competitor => competitor.team.id !== team.id
              );
              
              const updatedTeam = {
                ...newTeam,
                score: `${teamData.score || 0} - ${opponentData.score || 0}`,
                opponent: opponentData.team.shortDisplayName,
                status: game.status.type.shortDetail,
              };
              
              setFavoriteTeams(prevTeams => 
                prevTeams.map(t => t.id === team.id && t.league === selectedLeague ? updatedTeam : t)
              );
            }
          })
          .catch(err => console.error("Error fetching new team's scores:", err));
      }
    }
    
    // Reset form
    setShowAddForm(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveTeam = (id) => {
    setFavoriteTeams(favoriteTeams.filter(team => team.id !== id));
  };

  if (loading && favoriteTeams.length > 0) {
    return <div>Loading scores...</div>;
  }

  return (
    <div className="my-teams-page">
      <div className="page-header">
        <h1>My Teams</h1>
        <button 
          className="add-team-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Team'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-team-form">
          <h2>Add a New Team</h2>
          <div className="form-group">
            <label htmlFor="league-select">Select League:</label>
            <select 
              id="league-select"
              value={selectedLeague}
              onChange={(e) => {
                setSelectedLeague(e.target.value);
                setSearchResults([]);
                setSearchTerm('');
              }}
              className="form-control"
            >
              {availableLeagues.map(league => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="team-search">Search Teams:</label>
            <div className="search-container">
              <input
                id="team-search"
                type="text"
                placeholder="Enter team name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
              <button 
                onClick={handleSearch}
                disabled={searchTerm.length < 2 || loadingTeams}
                className="search-btn"
              >
                Search
              </button>
            </div>
          </div>
          
          {loadingTeams ? (
            <div className="search-loading">Loading teams...</div>
          ) : searching ? (
            <div className="search-loading">Searching teams...</div>
          ) : searchResults.length > 0 ? (
            <div className="search-results">
              <h3>Search Results:</h3>
              <div className="results-grid">
                {searchResults.map(team => (
                  <div key={team.id} className="result-card">
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`} 
                      className="team-logo" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/60/60";
                      }}
                    />
                    <span className="team-name">{team.name}</span>
                    <button 
                      onClick={() => handleAddTeam(team)}
                      className="add-btn"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : searchTerm.length > 0 && !loadingTeams ? (
            <div className="no-results">No teams found. Try a different search term.</div>
          ) : null}
        </div>
      )}

      <div className="teams-grid">
        {favoriteTeams.length > 0 ? (
          favoriteTeams.map(team => (
            <div key={`${team.id}-${team.league}`} className="team-card">
              <div className="team-header">
                <img 
                  src={team.logo} 
                  alt={`${team.name} logo`} 
                  className="team-logo" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/60/60";
                  }}
                />
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
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>You haven't added any favorite teams yet. Use the "Add Team" button to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeamsPage;