import React, { useState, useEffect } from 'react';

function HomePage() {
  // State for favorite teams - now loading from localStorage
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available leagues with their API paths (same as MyTeamsPage for consistency)
  const availableLeagues = [
    { id: 'NBA', name: 'NBA', apiPath: 'basketball/nba' },
    { id: 'WNBA', name: 'WNBA', apiPath: 'basketball/wnba' },
    { id: 'MLB', name: 'MLB', apiPath: 'baseball/mlb' },
    { id: 'NFL', name: 'NFL', apiPath: 'football/nfl' },
    { id: 'NHL', name: 'NHL', apiPath: 'hockey/nhl' },
    { id: 'EPL', name: 'Premier League Soccer', apiPath: 'soccer/eng.1' }
  ];

  // Load favorite teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('favoriteTeams');
    let initialTeams = [];
    
    if (savedTeams) {
      try {
        initialTeams = JSON.parse(savedTeams);
      } catch (e) {
        console.error("Error parsing saved teams:", e);
        // If parse fails, use default teams as fallback
        initialTeams = [
          { id: 1, name: "Lakers", league: "NBA", score: "0-0", opponent: "Warriors", status: "Loading...", logo: "/api/placeholder/60/60" },
          { id: 2, name: "Chiefs", league: "NFL", score: "0-0", opponent: "Ravens", status: "Loading...", logo: "/api/placeholder/60/60" }
        ];
      }
    } else {
      // Default teams if none are saved
      initialTeams = [
        { id: 1, name: "Lakers", league: "NBA", score: "0-0", opponent: "Warriors", status: "Loading...", logo: "/api/placeholder/60/60" },
        { id: 2, name: "Chiefs", league: "NFL", score: "0-0", opponent: "Ravens", status: "Loading...", logo: "/api/placeholder/60/60" }
      ];
    }
    
    setFavoriteTeams(initialTeams);
    setTeamsLoading(false);
  }, []);

  // Fetch scores for favorite teams whenever the list changes
  useEffect(() => {
    const fetchScores = async () => {
      if (favoriteTeams.length === 0 || teamsLoading) {
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

          try {
            const apiPath = leagueData.apiPath;
            const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${apiPath}/scoreboard`);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch scores for ${league}`);
            }
            
            const data = await response.json();
            
            // Update each team with its current game data
            return teams.map(team => {
              // Find game where this team is playing
              const game = data.events?.find(event =>
                event.competitions[0].competitors.some(competitor => 
                  competitor.team.shortDisplayName === team.name || 
                  competitor.team.name === team.name ||
                  (competitor.team.id && competitor.team.id === team.id.toString()))
              );

              if (game) {
                const teamData = game.competitions[0].competitors.find(
                  competitor => competitor.team.shortDisplayName === team.name || 
                    competitor.team.name === team.name ||
                    (competitor.team.id && competitor.team.id === team.id.toString())
                );
                
                const opponentData = game.competitions[0].competitors.find(
                  competitor => competitor.team.shortDisplayName !== team.name && 
                    competitor.team.name !== team.name &&
                    (!competitor.team.id || competitor.team.id !== team.id.toString())
                );

                return {
                  ...team,
                  score: `${teamData?.score || 0}-${opponentData?.score || 0}`,
                  opponent: opponentData?.team.shortDisplayName || opponentData?.team.name || team.opponent,
                  status: game.status.type.shortDetail || "Unknown",
                  logo: teamData?.team.logo || team.logo,
                };
              }

              // No game found, return with default "No games today" status
              return {
                ...team,
                score: "0-0",
                status: "No games today",
              };
            });
          } catch (error) {
            console.error(`Error fetching data for ${league}:`, error);
            return teams; // On error, return teams unchanged
          }
        });

        const updatedTeamsByLeague = await Promise.all(leaguePromises);
        const updatedTeams = updatedTeamsByLeague.flat();
        
        setFavoriteTeams(updatedTeams);
      } catch (err) {
        console.error("Error updating scores:", err);
      }
    };

    fetchScores();
  }, [favoriteTeams, teamsLoading]);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apis = [
          { url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news', sport: 'NBA' },
          { url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news', sport: 'MLB' },
          { url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news', sport: 'NFL' },
          { url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news', sport: 'EPL' },
        ];

        const fetchPromises = apis.map(api => fetch(api.url).then(res => {
          if (!res.ok) throw new Error(`Failed to fetch from ${api.url}`);
          return res.json();
        }));

        const results = await Promise.all(fetchPromises);

        // Collect all articles
        const allArticles = results.flatMap((data, index) =>
          data.articles.map((article, articleIndex) => ({
            id: `${index}-${articleIndex}`,
            headline: article.headline || "No headline available",
            category: apis[index].sport,
            date: article.published || new Date().toISOString(),
            image: article.images?.[0]?.url || '/api/placeholder/400/200',
            excerpt: article.description || "No description available.",
          }))
        );

        // Sort by date (newest first) and take the top 3
        const sortedArticles = allArticles.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setLatestNews(sortedArticles.slice(0, 3));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="home-page">
      <section className="welcome-banner">
        <h2>Welcome to MySports Hub</h2>
        <p>Your personalized dashboard for all your favorite teams and sports news</p>
      </section>
      
      <section className="my-teams-section">
        <div className="section-header">
          <h2>My Teams</h2>
          <a href="/myteams" className="add-team-btn">+ Add Team</a>
        </div>
        
        <div className="teams-grid">
          {teamsLoading ? (
            <div>Loading your teams...</div>
          ) : favoriteTeams.length > 0 ? (
            <>
              {favoriteTeams.slice(0, 4).map(team => (
                <div key={team.id} className="team-card">
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
              {favoriteTeams.length < 4 && (
                <a href="/myteams" className="team-card add-team-card">
                  <div className="add-icon">+</div>
                  <p>Add another favorite team</p>
                </a>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No favorite teams yet. Add some teams to get started!</p>
              <a href="/myteams" className="empty-add-btn">Add Teams</a>
            </div>
          )}
        </div>
      </section>
      
      <section className="news-section">
        <div className="section-header">
          <h2>Latest News</h2>
          <a href="/news" className="view-all">View All</a>
        </div>
        
        <div className="news-container">
          {loading ? (
            <div>Loading latest news...</div>
          ) : error ? (
            <div>Error loading news: {error}</div>
          ) : latestNews.length > 0 ? (
            latestNews.map(item => (
              <div key={item.id} className="news-card">
                <span className="news-category">{item.category}</span>
                <h3>{item.headline}</h3>
                <p className="news-date">{new Date(item.date).toLocaleDateString()}</p>
                <p className="news-excerpt">{item.excerpt.substring(0, 100)}...</p>
                <a href={`/news?articleId=${item.id}`} className="read-more">Read More</a>
              </div>
            ))
          ) : (
            <div>No recent news available.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;