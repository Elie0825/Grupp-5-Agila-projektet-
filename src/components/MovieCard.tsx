import React from 'react';
import { Movie, MovieCardProps } from '../types/movie';
import '../CSS/MovieCard.css'; // Importera den dedikerade CSS-filen

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  // Formatera releasedatum till läsbart format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };

  // Kontrollera om filmen har släppts
  const isMovieReleased = (releaseDate: string): boolean => {
    const today = new Date();
    const releaseDay = new Date(releaseDate);
    return releaseDay <= today;
  };

  // Beräkna genomsnittsbetyg från IMDB, RT och MC
  const calculateAverageRating = (
    imdbRating: number | null | undefined, 
    rtRating: number | null | undefined, 
    mcRating: number | null | undefined
  ): number | null => {
    // Om IMDB-betyget saknas, försök använda andra betyg om de finns
    const hasImdb = imdbRating !== null && imdbRating !== undefined;
    const hasRt = rtRating !== null && rtRating !== undefined;
    const hasMc = mcRating !== null && mcRating !== undefined;
    
    // Om inga betyg finns alls
    if (!hasImdb && !hasRt && !hasMc) {
      return null;
    }
    
    let validRatings = 0;
    let sum = 0;
    
    // Lägg till IMDB om det finns
    if (hasImdb) {
      sum += imdbRating!;
      validRatings++;
    }
    
    // Lägg till RT om det finns (konvertera till skala 0-10)
    if (hasRt) {
      sum += rtRating! / 10;
      validRatings++;
    }
    
    // Lägg till MC om det finns (konvertera till skala 0-10)
    if (hasMc) {
      sum += mcRating! / 10;
      validRatings++;
    }
    
    // Om inga giltiga betyg fanns
    if (validRatings === 0) {
      return null;
    }

    // Beräkna medelvärdet
    const averageRating = sum / validRatings;

    // Returnera medelvärdet med en decimal precision
    return parseFloat(averageRating.toFixed(1));
  };
  
  // Beräkna betygsvärdet
  const ratingValue = calculateAverageRating(
    movie.imdb_rating, 
    movie.rt_rating, 
    movie.mc_rating
  );

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
      </figure>
      
      <section className="movie-info">
        {/* Visa genomsnittsbetyg eller "Coming soon" beroende på om filmen har släppts */}
        {isMovieReleased(movie.release_date) ? (
          <div className="movie-rating">
            {ratingValue !== null ? ratingValue : "N/A"}
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