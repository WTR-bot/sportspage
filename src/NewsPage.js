import React, { useState } from 'react';

function NewsPage() {
  // Sample expanded news data
  const [newsArticles, setNewsArticles] = useState([
    { 
      id: 1, 
      headline: "Trade deadline approaches: Which teams are making moves?", 
      category: "General",
      date: "March 29, 2025",
      image: "/api/placeholder/400/200",
      excerpt: "As the trade deadline looms, several teams are positioning themselves for playoff runs while others look to rebuild. Our analysts break down the most likely moves.",
      featured: true
    },
    { 
      id: 2, 
      headline: "MVP race heats up as playoffs approach", 
      category: "NBA",
      date: "March 28, 2025",
      image: "/api/placeholder/400/200",
      excerpt: "With just weeks left in the regular season, the MVP race has narrowed to three top candidates. We analyze their performances and chances.",
      featured: true
    },
    { 
      id: 3, 
      headline: "Draft day predictions: Top picks analysis", 
      category: "NFL",
      date: "March 27, 2025",
      image: "/api/placeholder/400/200",
      excerpt: "Our scouts have analyzed the top college prospects and are predicting some surprising selections in the first round of the upcoming draft.",
      featured: false
    },
    { 
      id: 4, 
      headline: "Rookie sensation breaks franchise record in debut season", 
      category: "MLB",
      date: "March 26, 2025",
      image: "/api/placeholder/400/200",
      excerpt: "The 19-year-old phenom has taken the league by storm, breaking a 50-year-old franchise record for home runs by a rookie before the All-Star break.",
      featured: false
    },
    { 
      id: 5, 
      headline: "International tournament announces expanded format for 2026", 
      category: "Soccer",
      date: "March 25, 2025",
      image: "/api/placeholder/400/200",
      excerpt: "The world's biggest soccer tournament will expand to include more teams in the 2026 edition, giving more nations a chance to compete on the global stage.",
      featured: false
    },
    { 
      id: 6, 
      headline: "Major upset in championship semifinals stuns fans worldwide", 
      category: "Tennis",
      date: "March 24, 2025",
      image: "/api/placeholder/400/200",
      excerpt: "In what analysts are calling the biggest upset in a decade, the unseeded player defeated the tournament favorite in a thrilling five-set match.",
      featured: false
    }
  ]);
  
  const categories = ["All", "General", "NBA", "NFL", "MLB", "Soccer", "Tennis", "Hockey", "Golf"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredNews = newsArticles.filter(article => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    const matchesSearch = article.headline.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const featuredArticles = filteredNews.filter(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);
  
  return (
    <div className="news-page">
      <div className="page-header">
        <h1>Sports News</h1>
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
      
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {featuredArticles.length > 0 && (
        <section className="featured-news">
          <h2>Featured Stories</h2>
          <div className="featured-grid">
            {featuredArticles.map(article => (
              <div key={article.id} className="featured-card">
                <img src={article.image} alt={article.headline} className="featured-image" />
                <div className="featured-content">
                  <span className="news-category">{article.category}</span>
                  <h3>{article.headline}</h3>
                  <p className="news-date">{article.date}</p>
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
                  <p className="news-date">{article.date}</p>
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