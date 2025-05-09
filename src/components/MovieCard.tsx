import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie, MovieCardProps } from '../types/movie';
import '../CSS/MovieCard.css';

const OMDB_API_KEY = "8f57b2c1"; // Hårdkodad API-nyckel

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  // Favoritstate som hämtas från localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const isFavorite = favorites.includes(movie.id.toString());

  const toggleFavorite = () => {
    let updatedFavorites;
    if (isFavorite) {
      // Ta bort från favoriter
      updatedFavorites = favorites.filter(id => id !== movie.id.toString());
    } else {
      // Lägg till i favoriter
      updatedFavorites = [...favorites, movie.id];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Uppdaterad state-typ med union type number | null för att lösa TypeScript-felet
  const [ratings, setRatings] = useState<{
    imdb: number | null;
    rt: number | null;
    mc: number | null;
  }>({
    imdb: null,
    rt: null,
    mc: null
  });

  // Hämta betyg från OMDb API
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('https://www.omdbapi.com/', {
          params: {
            apikey: OMDB_API_KEY,
            t: movie.title,
            y: new Date(movie.release_date).getFullYear()
          }
        });
        
        if (response.data && response.data.Response === "True") {
          // Skapa ett temporärt objekt för att bygga upp betygen
          const newRatings = { 
            imdb: null as number | null, 
            rt: null as number | null, 
            mc: null as number | null 
          };
          
          // IMDb
          if (response.data.imdbRating && response.data.imdbRating !== "N/A") {
            newRatings.imdb = parseFloat(response.data.imdbRating);
          }
          
          // Rotten Tomatoes
          if (response.data.Ratings) {
            const rtRating = response.data.Ratings.find((r: any) => r.Source === 'Rotten Tomatoes');
            if (rtRating && rtRating.Value) {
              newRatings.rt = parseInt(rtRating.Value.replace('%', ''));
            }
          }
          
          // Metacritic
          if (response.data.Metascore && response.data.Metascore !== "N/A") {
            newRatings.mc = parseInt(response.data.Metascore);
          }
          
          setRatings(newRatings);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    
    // Hämta alltid betyg direkt från OMDb
    if (isMovieReleased(movie.release_date)) {
      fetchRatings();
    }
  }, [movie.title, movie.release_date]);
  
  // Beräkna genomsnittsbetyg från OMDb-data
  const calculateAverageRating = (): number | null => {
    const validRatings = [
      ratings.imdb,
      ratings.rt ? ratings.rt / 10 : null,
      ratings.mc ? ratings.mc / 10 : null
    ].filter((r): r is number => r !== null);
    
    if (validRatings.length === 0) return null;
    
    const average = validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
    return parseFloat(average.toFixed(1));
  };

  // Kontrollera om filmen har släppts
  const isMovieReleased = (releaseDate: string): boolean => {
    const today = new Date();
    const releaseDay = new Date(releaseDate);
    return releaseDay <= today;
  };

  const ratingValue = calculateAverageRating();

  return (
    <article className="movie-card" onClick={() => onClick(movie)}>
       {/* Favoritknapp */}
       <button 
        className="favorite-button" 
        onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
        aria-label={isFavorite ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      <figure className="movie-poster">
        {movie.cover_url ? (
          <img src={movie.cover_url} alt={`Filmposter för ${movie.title}`} />
        ) : (
          <figcaption className="no-poster" aria-label="Ingen bild tillgänglig">
            Ingen bild
          </figcaption>
        )}
      </figure>
      
      <section className="movie-info">
        {isMovieReleased(movie.release_date) ? (
          <div className="movie-rating">
            {ratingValue !== null ? ratingValue.toFixed(1) : "N/A"}
          </div>
        ) : (
          <span className="coming-soon-card">Coming soon...</span>
        )}
        
        <header>
          <h2 className="movie-title">{movie.title}</h2>
        </header>
      </section>
    </article>
  );
};

export default MovieCard;