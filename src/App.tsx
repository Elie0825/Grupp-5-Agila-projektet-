import React, { useState, useEffect } from "react";
import { fetchMarvelMovies } from "./services/api";
import { Movie } from "./types/movie";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import SearchFilter from "./components/SearchFilter";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import "./App.css";
import "./CSS/Navbar.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("title");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await fetchMarvelMovies();
        
        if (fetchedMovies.length === 0) {
          setError("Inga filmer hittades. API:et kan vara nere.");
        } else {
          setMovies(fetchedMovies);
        }
      } catch (err) {
        setError("Ett fel uppstod vid hämtning av filmer.");
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  // Filtrerar filmer baserat på sökterm, fas och betyg
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = selectedPhase === null || movie.phase === selectedPhase;
    const matchesRating = selectedRating === null || movie.rating >= selectedRating;

    return matchesSearch && matchesPhase && matchesRating;
  });

  // Sorterar filmer efter titel, betyg eller datum
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "rating":
        return b.rating - a.rating;
      case "release":
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      default:
        return 0;
    }
  });

  // Hämtar alla unika faser
  const phases = [...new Set(movies.map(movie => movie.phase))].sort();

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <header className="main-header">
                <h1>Marvel Filmuniversum</h1>
                <p>Utforska filmer från Marvel Cinematic Universe</p>
              </header>

              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedPhase={selectedPhase}
                onPhaseChange={setSelectedPhase}
                phases={phases}
                selectedRating={selectedRating}
                onRatingChange={setSelectedRating}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <main>
                {loading && (
                  <>
                    <section className="status-message">
                      <output className="loading" role="status" aria-live="polite">
                        <span className="loading-spinner"></span>
                        <p>Laddar filmer...</p>
                      </output>
                    </section>

                    <section className="movie-grid"> 
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="ghost-card" aria-hidden="true" />
                      ))}
                    </section>
                  </>
                )}

                {error && (
                  <section className="status-message">
                    <output className="error" role="alert">
                      <h2>Ett fel uppstod</h2>
                      <p>{error}</p>
                    </output>
                  </section>
                )}

                {!loading && !error && (
                  <section className="movies-section">
                    <output className="movies-count" aria-live="polite">
                      Visar {sortedMovies.length} av {movies.length} filmer
                    </output>

                    {sortedMovies.length === 0 ? (
                      <p className="no-results">Inga filmer matchade dina sökkriterier.</p>
                    ) : (
                      <section className="movie-grid" role="feed" aria-busy="false">
                        {sortedMovies.map(movie => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onClick={handleMovieClick}
                          />
                        ))}
                      </section>
                    )}
                  </section>
                )}
              </main>

              {selectedMovie && (
                <MovieDetails
                  movie={selectedMovie}
                  onClose={handleCloseDetails}
                />
              )}

              <footer>
                <p>Data hämtad från MCU API</p>
                <p>&copy; <time dateTime={new Date().getFullYear().toString()}>{new Date().getFullYear()}</time> Marvel Filmvisare</p>
              </footer>
            </div>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;