// src/components/MovieCard.tsx
import React from 'react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  // Formatera releasedatum till läsbart format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };

  return (
    <article className="movie-card" onClick={() => onClick(movie)}>
      <figure className="movie-poster">
        {movie.cover_url ? (
          <img src={movie.cover_url} alt={`Filmposter för ${movie.title}`} />
        ) : (
          <figcaption className="no-poster" aria-label="Ingen bild tillgänglig">
            Ingen bild
          </figcaption>
        )}
        <mark className="phase-badge">Fas {movie.phase}</mark>
      </figure>
      
      <section className="movie-info">
        <header>
          <h2>{movie.title}</h2>
          <time dateTime={movie.release_date}>{formatDate(movie.release_date)}</time>
        </header>
        
        {movie.overview && (
          <p className="movie-description">
            {movie.overview.length > 100 
              ? `${movie.overview.substring(0, 100)}...` 
              : movie.overview}
          </p>
        )}
      </section>
    </article>
  );
};

export default MovieCard;