import React from 'react';
import { Movie, MovieCardProps } from '../types/movie';
import '../css/MovieCard.css';

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  // Beräkna genomsnittsbetyg från befintlig data
  const calculateAverageRating = (): number | null => {
    const validRatings = [
      movie.imdb_rating,
      movie.rt_rating ? movie.rt_rating / 10 : null,
      movie.mc_rating ? movie.mc_rating / 10 : null
    ].filter((r): r is number => r !== null && r !== undefined);
    
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

  // Fallback-bild om cover_url saknas eller är felaktig
  const defaultImage = '/headerbild.svg';
  
  // Hantera bildfel - använd en fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage;
  };

  const ratingValue = calculateAverageRating();

  // Korrigera bildsökvägen om den börjar med "public/"
  const getImagePath = (path: string | undefined): string => {
    if (!path) return defaultImage;
    return path.replace('public/', '');
  };

  return (
    <article className="movie-card" onClick={() => onClick(movie)}>
      <div className="movie-image-container">
        {movie.cover_url ? (
          <img 
            src={getImagePath(movie.cover_url)} 
            alt={`Filmposter för ${movie.title}`}
            className="movie-image"
            onError={handleImageError}
          />
        ) : (
          <div className="no-image" aria-label="Ingen bild tillgänglig">
            Ingen bild
          </div>
        )}
      </div>
      
      <section className="movie-info">
        {isMovieReleased(movie.release_date) ? (
          <div className="movie-rating">
          <span className="rating-value">{ratingValue !== null ? ratingValue.toFixed(1) : "N/A"}</span>
        </div>
        ) : (
          <span className="coming-soon-card">Coming soon...</span>
        )}
        
        <h2 className="movie-title">{movie.title}</h2>
      </section>
    </article>
  );
};

export default MovieCard;