import React, { useState, useEffect } from 'react';
import { MarvelCharacters } from '../types/character';
import { Movie } from '../types/movie';
import CharacterCard from './CharacterCard';
import CharacterDetails from './CharacterDetails';
import MovieDetails from './MovieDetails';
import '../css/CharactersPage.css';

const CharactersPage: React.FC = () => {
  const [characters, setCharacters] = useState<MarvelCharacters[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<MarvelCharacters[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<MarvelCharacters | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Hämta karaktärer från den lokala JSON-filen
        const charactersResponse = await fetch('/marvelcharacters.json');
        if (!charactersResponse.ok) {
          throw new Error('Kunde inte hämta karaktärer från lokal fil');
        }
        const charactersData: MarvelCharacters[] = await charactersResponse.json();
        setCharacters(charactersData);
        setFilteredCharacters(charactersData);
        
        // Hämta filmer från den lokala JSON-filen
        const moviesResponse = await fetch('/marvelmovies.json');
        if (!moviesResponse.ok) {
          throw new Error('Kunde inte hämta filmer från lokal fil');
        }
        const moviesData: Movie[] = await moviesResponse.json();
        setMovies(moviesData);
        
        setLoading(false);
      } catch (error) {
        console.error('Fel vid hämtning av data:', error);
        setError('Ett fel uppstod vid hämtning av data. Försök igen senare.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Uppdatera filtrerade karaktärer när söktermen ändras
    if (searchTerm.trim() === '') {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter(character => 
        character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (character.real_name && character.real_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCharacters(filtered);
    }
  }, [searchTerm, characters]);

  const handleCharacterClick = (character: MarvelCharacters) => {
    setSelectedCharacter(character);
    setSelectedMovie(null); // Stäng filmdetaljer om öppna
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedCharacter(null); // Stäng karaktärsdetaljer
  };

  const handleCloseCharacterDetails = () => {
    setSelectedCharacter(null);
  };

  const handleCloseMovieDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <main className="characters-page">
      <header className="characters-hero">
        {/* <p className="text">
          <span className="big-span">Marvelous RATINGS <br /></span>
          Utforska dina favoritkaraktärer från Marvel-universumet!
          Lär dig mer om karaktärernas bakgrund och vilka filmer de medverkar i.
          <br /> Allt samlat, allt Marvel, MARVELOUS!
        </p>*/}
      </header>

      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Sök efter karaktärer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Sök efter karaktärer"
          />
        </div>
      </section>

      <section className="characters-content">
        {loading ? (
          <div className="loading" role="status">
            <span>Laddar karaktärer...</span>
          </div>
        ) : error ? (
          <article className="error-message" role="alert">
            <h2>Ett fel uppstod</h2>
            <p>{error}</p>
          </article>
        ) : filteredCharacters.length === 0 ? (
          <article className="no-results">
            <h2>Inga karaktärer hittades</h2>
            <p>Försök med en annan sökning eller kontrollera din anslutning.</p>
          </article>
        ) : (
          <div className="characters-grid">
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={handleCharacterClick}
              />
            ))}
          </div>
        )}
      </section>

      {selectedCharacter && (
        <CharacterDetails
          character={selectedCharacter}
          onClose={handleCloseCharacterDetails}
          movies={movies}
          onMovieClick={handleMovieClick}
        />
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          movies={movies} // Skickar med movies-array för förbättrad matchning
          onClose={handleCloseMovieDetails}
          onCharacterClick={handleCharacterClick}
        />
      )}

      <footer className="characters-footer">
        <p>Data hämtad från SuperHero API © 2025 Marvel Karaktärer</p>
      </footer>
    </main>
  );
};

export default CharactersPage;