import React, { useState, useEffect } from 'react';

function MyTeamsPage() {
  const [favoriteTeams, setFavoriteTeams] = useState([
    { id: 1, name: "Lakers", league: "NBA", score: "0-0", opponent: "Warriors", status: "Upcoming", logo: "/api/placeholder/60/60" },
    { id: 2, name: "Celtics", league: "NBA", score: "0-0", opponent: "Heat", status: "Upcoming", logo: "/api/placeholder/60/60" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }
        const data = await response.json();

        const updatedTeams = favoriteTeams.map(team => {
          const game = data.events.find(event =>
            event.competitions[0].competitors.some(competitor => competitor.team.shortDisplayName === team.name)
          );

          if (game) {
            const teamData = game.competitions[0].competitors.find(competitor => competitor.team.shortDisplayName === team.name);
            const opponentData = game.competitions[0].competitors.find(competitor => competitor.team.shortDisplayName !== team.name);

            return {
              ...team,
              score: `${teamData.score} - ${opponentData.score}`,
              opponent: opponentData.team.shortDisplayName,
              status: game.status.type.shortDetail,
              logo: teamData.team.logo || team.logo,
            };
          }

          return team;
        });

        setFavoriteTeams(updatedTeams);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const handleRemoveTeam = (id) => {
    setFavoriteTeams(favoriteTeams.filter(team => team.id !== id));
  };

  if (loading) {
    return <div>Loading scores...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-teams-page">
      <div className="page-header">
        <h1>My Teams</h1>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTeamsPage;