import React, { useState, useEffect } from 'react';

function NewsPage() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Removed category filtering

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

        const topStories = results.map((data, index) => ({
          id: index + 1,
          headline: data.articles[0]?.headline || "No headline available",
          category: apis[index].sport,
          date: data.articles[0]?.published || new Date().toISOString(),
          image: data.articles[0]?.images?.[0]?.url || '/api/placeholder/400/200',
          excerpt: data.articles[0]?.description || "No description available.",
        }));

        setFeaturedArticles(topStories);

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

        setNewsArticles(allArticles);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.headline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const regularArticles = filteredNews.filter(article =>
    !featuredArticles.some(featured => featured.headline === article.headline)
  );

  if (loading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>News</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {featuredArticles.length > 0 && (
        <section className="featured-news">
          <h2>Featured Stories</h2>
          <div className="featured-grid">
            {featuredArticles.map(article => (
              <div key={article.id} className="featured-card">
                <img 
                  src={article.image} 
                  alt={article.headline} 
                  className="featured-image"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "/api/placeholder/400/200";
                  }}
                />
                <div className="featured-content">
                  <span className="news-category">{article.category}</span>
                  <h3>{article.headline}</h3>
                  <p className="news-date">{new Date(article.date).toLocaleDateString()}</p>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <a href={`#news/${article.id}`} className="read-more">Read Full Story</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="latest-news">
        <h2>Latest News</h2>
        <div className="news-grid">
          {regularArticles.length > 0 ? (
            regularArticles.map(article => (
              <div key={article.id} className="news-card">
                <img src={article.image} alt={article.headline} className="news-image" />
                <div className="news-content">
                  <span className="news-category">{article.category}</span>
                  <h3>{article.headline}</h3>
                  <p className="news-date">{new Date(article.date).toLocaleDateString()}</p>
                  <p className="news-excerpt">{article.excerpt}</p>
                  <a href={`#news/${article.id}`} className="read-more">Read More</a>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No news articles match your search. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NewsPage;