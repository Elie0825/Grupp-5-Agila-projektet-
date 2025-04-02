import React from 'react';
import { Movie, MovieCardProps } from '../types/movie';
import '../CSS/MovieCard.css'; // Importera den dedikerade CSS-filen

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

  // Kontrollera om filmen har släppts
  const isMovieReleased = (releaseDate: string): boolean => {
    const today = new Date();
    const releaseDay = new Date(releaseDate);
    return releaseDay <= today;
  };

  // Formatera betyg till decimalformat (t.ex. 7 blir 7.0)
  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
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
      </figure>
      
      <section className="movie-info">
        <header>
          <h2 className="movie-title">{movie.title}</h2>
        </header>
        
        {/* Visa IMDb-betyg eller "Coming soon" beroende på om filmen har släppts */}
        {isMovieReleased(movie.release_date) ? (
          <>
            {movie.imdb_rating && <span className="movie-rating">{formatRating(movie.imdb_rating)}</span>}
            {movie.release_date && (
              <>
                {movie.imdb_rating && " | "}
                <span className="release-year">{new Date(movie.release_date).getFullYear()}</span>
              </>
            )}
          </>
        ) : (
          <span className="coming-soon-card">Coming soon...</span>
        )}
      </section>
    </article>
  );
};

export default MovieCard;