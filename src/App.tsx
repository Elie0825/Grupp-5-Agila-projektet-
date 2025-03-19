// src/App.tsx
import React, { useEffect, useState } from "react";
import { fetchMarvelMovies } from "./services/api";
import { Movie } from "./types/movie";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import SearchFilter from "./components/SearchFilter";
import "./App.css";

function App() {
  // Grundläggande tillstånd
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Hämta filmer när komponenten mountas
  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await fetchMarvelMovies(); //hämtar filmer
        
        if (fetchedMovies.length === 0) {
          setError("Inga filmer hittades. API:et kan vara nere.");
        } else {
          setMovies(fetchedMovies); // uppdaterar state med filmerna
        }
      } catch (err) {
        setError("Ett fel uppstod vid hämtning av filmer.");
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []); // körs en gång


  // Hanterare för filmkortklick
  const handleMovieClick = (movie: Movie) => { /** movie: Movie betyder att argumentet 
    movie måste vara av typen Movie med rätt egenskaper (interface) */
    setSelectedMovie(movie);
  };

  // Hanterare för att stänga detaljvy
  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  // Filtrera filmer baserat på sökterm och fas
  const filteredMovies = movies.filter(movie => { /** movies är en array av filmer (Movie[]) 
    och .filter skapar en ny array med endast de filmer som uppfyller villkoren. */
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = selectedPhase === null || movie.phase === selectedPhase;
    /** Om ingen fas är vald, visa alla filmer.
        Om en fas är vald, visa endast filmer i den fasen. */
    return matchesSearch && matchesPhase;
  });

  /** Denna kod skapar en lista över unika Marvel-faser 
  från movies och sorterar dem i ordning.
   * SET lagrar unika värden så dubletter försvinner från dropwoen menyn
   */
  const phases = [...new Set(movies.map(movie => movie.phase))].sort();

  return (
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
              Visar {filteredMovies.length} av {movies.length} filmer
            </output>
            
            {filteredMovies.length === 0 ? (
              <p className="no-results">Inga filmer matchade dina sökkriterier.</p>
            ) : (
              <section className="movie-grid" role="feed" aria-busy="false">
                {filteredMovies.map(movie => (
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