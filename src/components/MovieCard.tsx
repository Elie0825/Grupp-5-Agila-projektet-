// src/components/MovieCard.tsx
import React from 'react';
import { Movie, MovieCardProps } from '../types/movie';



const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => { // destrukturerade propd från app.tsx
  /** React.FC betyder att detta är en funktionell komponent i React.
  <MovieCardProps> betyder att komponenten har specifika props, 
  definierade av interface MovieCardProps. */
  
  // Formatera releasedatum till läsbart format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }; 
    // inbyggd typ i TypeScript som gör datumformatering flexibel och anpassningsbar
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };

  return (
    <article className="movie-card" onClick={() => onClick(movie)}> 
    {/** onClick={() => onClick(movie)} → När användaren klickar på kortet:
      Anropas onClick(movie), som är en prop från App.tsx.
      handleMovieClick(movie) körs i App.tsx och uppdaterar selectedMovie.
      MovieDetails.tsx visas med information om den valda filmen. */}

      <figure className="movie-poster">
        {movie.cover_url ? ( // Visar filmpostern om den finns
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
        
        {movie.overview && ( /**Om movie.overview är null eller undefined, renderas inget.
          Om movie.overview finns, fortsätter koden att rendera <p>-elementet. */
          <p className="movie-description">
            {movie.overview.length > 100 //  Om movie.overview.length > 100, kortas texten ner
              ? `${movie.overview.substring(0, 100)}...` 
              : movie.overview}
          </p>
        )}
      </section>
    </article>
  );
};

export default MovieCard;