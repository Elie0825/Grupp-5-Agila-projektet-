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

  // Beräkna genomsnittsbetyg från IMDB, RT och MC
  const calculateAverageRating = (
    imdbRating: number | null | undefined, 
    rtRating: number | null | undefined, 
    mcRating: number | null | undefined
  ): number | null => {
    // Om IMDB-betyget saknas, returnera null
    if (!imdbRating) {
      return null;
    }
    
    // Räkna ut hur många giltiga betyg vi har
    let validRatings = 1; // IMDB finns alltid om vi kommit hit
    let sum = imdbRating;
    
    // Lägg till RT om det finns
    if (rtRating) {
      sum += rtRating / 10; // Konvertera till skala 0-10
      validRatings++;
    }
    
    // Lägg till MC om det finns
    if (mcRating) {
      sum += mcRating / 10; // Konvertera till skala 0-10
      validRatings++;
    }

    // Beräkna medelvärdet
    const averageRating = sum / validRatings;

    // Returnera medelvärdet med en decimal precision
    return parseFloat(averageRating.toFixed(1));
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
        {/* Visa genomsnittsbetyg eller "Coming soon" beroende på om filmen har släppts */}
        {isMovieReleased(movie.release_date) ? (
          <div className="movie-rating">
            {movie.imdb_rating && 
              calculateAverageRating(movie.imdb_rating, movie.rt_rating || null, movie.mc_rating || null)?.toFixed(1)
            }
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