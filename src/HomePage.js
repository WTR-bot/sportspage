import React, { useState, useEffect } from 'react';

function HomePage() {
  // State for favorite teams
  const [favoriteTeams, setFavoriteTeams] = useState([
    { id: 1, name: "Lakers", league: "NBA", score: "108-102", opponent: "Warriors", status: "Final", logo: "/api/placeholder/60/60" },
    { id: 2, name: "Chiefs", league: "NFL", score: "24-17", opponent: "Ravens", status: "Final", logo: "/api/placeholder/60/60" },
    { id: 3, name: "Yankees", league: "MLB", score: "5-3", opponent: "Red Sox", status: "7th Inning", logo: "/api/placeholder/60/60" },
    { id: 4, name: "Real Madrid", league: "La Liga", score: "2-1", opponent: "Barcelona", status: "85'", logo: "/api/placeholder/60/60" }
  ]);

  // State for news articles
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data using the same APIs from NewsPage
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apis = [
          { url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news', sport: 'NBA' },
          { url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/news', sport: 'WNBA' },
          { url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news', sport: 'MLB' },
          { url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news', sport: 'NHL' },
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
          {favoriteTeams.slice(0, 4).map(team => (
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
          <a href="/myteams" className="team-card add-team-card">
            <div className="add-icon">+</div>
            <p>Add another favorite team</p>
          </a>
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
          ) : (
            latestNews.map(item => (
              <div key={item.id} className="news-card">
                <span className="news-category">{item.category}</span>
                <h3>{item.headline}</h3>
                <p className="news-date">{new Date(item.date).toLocaleDateString()}</p>
                <p className="news-excerpt">{item.excerpt.substring(0, 100)}...</p>
                <a href={`/news?articleId=${item.id}`} className="read-more">Read More</a>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;