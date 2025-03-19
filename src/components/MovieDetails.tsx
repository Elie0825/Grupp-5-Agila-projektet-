// src/components/MovieDetails.tsx
import React from 'react';
import { Movie } from '../types/movie';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  // Formatera releasedatum till läsbart format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };
  
  // Formatera speltid från minuter till timmar och minuter
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <aside className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="movie-title">
      <article className="movie-details">
        <header className="details-header">
          <h2 id="movie-title">{movie.title}</h2>
          <button 
            className="close-button" 
            onClick={onClose} 
            aria-label="Stäng detaljer"
          >
            ×
          </button>
        </header>
        
        <section className="details-content">
          <figure className="details-poster">
            {movie.cover_url ? (
              <img src={movie.cover_url} alt={`Filmposter för ${movie.title}`} />
            ) : (
              <figcaption className="no-poster">Ingen bild tillgänglig</figcaption>
            )}
          </figure>
          
          <section className="details-info">
            <dl>
              <dt>Utgivningsdatum:</dt>
              <dd><time dateTime={movie.release_date}>{formatDate(movie.release_date)}</time></dd>
              
              <dt>Längd:</dt>
              <dd>{formatDuration(movie.duration)}</dd>
              
              <dt>Regissör:</dt>
              <dd>{movie.directed_by}</dd>
              
              <dt>MCU Fas:</dt>
              <dd><mark className="phase-badge">Fas {movie.phase}</mark></dd>
              
              <dt>Saga:</dt>
              <dd>{movie.saga}</dd>
            </dl>
            
            {movie.imdb_id && (
              <a 
                href={`https://www.imdb.com/title/${movie.imdb_id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="imdb-link"
              >
                Visa på IMDb
              </a>
            )}
          </section>
        </section>
        
        <section className="details-description">
          <h3>Handling</h3>
          <p>{movie.overview || "Ingen beskrivning tillgänglig."}</p>
        </section>
        
        {movie.trailer_url && (
          <section className="trailer-section">
            <h3>Trailer</h3>
            <figure className="trailer-container">
              <iframe 
                src={movie.trailer_url.replace('watch?v=', 'embed/')} 
                title={`${movie.title} trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </figure>
          </section>
        )}
      </article>
    </aside>
  );
};

export default MovieDetails;