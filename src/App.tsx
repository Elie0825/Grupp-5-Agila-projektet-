// src/App.tsx
import React, { useEffect, useState } from "react";
import { fetchMarvelMovies } from "./services/api";
import { Movie } from "./types/movie";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import SearchFilter from "./components/SearchFilter";
import "./App.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("title");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  // Ta bort typeFilters och genreFilters eftersom de inte stöds av Movie-typen
  const [showTypeFilters, setShowTypeFilters] = useState(false);
  const [showGenreFilters, setShowGenreFilters] = useState(false);

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

    // Ta bort type- och genre-filteringen eftersom dessa fält inte finns
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
 // Hämtar alla unika faser (t.ex. [1, 2, 3])
  const phases = [...new Set(movies.map(movie => movie.phase))].sort();

  return (
    <div className="app-container">
      <header className="main-header">
        <h1>Marvel Filmuniversum</h1>
        <p>Utforska filmer från Marvel Cinematic Universe</p>
      </header>
    {/* Sök- och filterkomponent */}
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
        // Ta bort type- och genre-filter props
      />
      <main>
        {loading && (
          <section className="status-message">
            <output className="loading" role="status" aria-live="polite">
              <span className="loading-spinner"></span>
              <p>Laddar filmer...</p>
            </output>
          </section>
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
  );
}

export default App;