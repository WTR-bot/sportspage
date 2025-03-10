import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sports Main Page</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#news">News</a></li>
            <li><a href="#myTeams">My Teams</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section>
          <h2>Welcome to my Capstone project</h2>
          <p>Your one-stop destination for all sports news and updates.</p>
        </section>
        <section>
          <h2>Latest News</h2>
          <p>Stay tuned for the latest sports news.</p>
        </section>
        <section>
          <h2>Favorites</h2>
          <div className="grid-container">
            <div className="grid">
              <div className="grid-item">Favorite 1</div>
              <div className="grid-item">Favorite 2</div>
              <div className="grid-item">Favorite 3</div>
              <div className="grid-item">Favorite 4</div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Capstone</p>
      </footer>
    </div>
  );
}

export default App;
