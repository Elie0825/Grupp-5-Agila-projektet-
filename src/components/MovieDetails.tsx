import React, { useEffect, useRef } from 'react';
import { Movie, MovieDetailsProps } from '../types/movie';
import '../CSS/MovieDetails.css'; // Importera den dedikerade CSS-filen

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  // Formatera releasedatum till läsbart format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };

  // Skapar refs för att kunna kolla om man klickar utanför moviedetails
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Effekt som lyssnar på klick utanför modalfönstret för att stänga det
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Om användaren klickar utanför modalfönstret, stäng modalen
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Lägg till eventlistener för klick
    document.addEventListener('mousedown', handleClickOutside);

    // Rensa eventlistener vid komponentens avmontering
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  
  // Formatera speltid från minuter till timmar och minuter
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Hämta årtalet från releasedatum
  const getReleaseYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  // Kontrollera om filmen har släppts
  const isMovieReleased = (releaseDate: string): boolean => {
    const today = new Date();
    const releaseDay = new Date(releaseDate);
    return releaseDay <= today;
  };

  // Förhindra scrollning på body när modalen är öppen
  useEffect(() => {
    document.body.classList.add('modal-open');
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleClose = () => {
    document.body.classList.remove('modal-open');
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Fiktiva genres för demo (lägg till i Movie-typen och API om det behövs i framtiden)
  const genres = ['Sci-Fi', 'Superhero', 'Action', 'Adventure'];

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
    <aside 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="movie-title"
      onClick={handleClose}
    >
      <article className="movie-details" onClick={handleModalClick} ref={modalRef}>
        {/* Stängningsknapp */}
        <button className="close-button" onClick={handleClose} aria-label="Stäng detaljer">
          ×
        </button>
        
        {/* Bakgrundsbild med blur */}
        {movie.cover_url && (
          <div 
            className="details-background" 
            style={{ backgroundImage: `url(${movie.cover_url})` }} 
            aria-hidden="true"
          />
        )}

        {/* Filmpostern överst */}
        <div className="details-top-section">
          <figure className="details-poster">
            {movie.cover_url ? (
              <img src={movie.cover_url} alt={`Filmposter för ${movie.title}`} />
            ) : (
              <figcaption className="no-poster">Ingen bild tillgänglig</figcaption>
            )}
          </figure>
        </div>

        {/* Titel och metadata med integrerad betygssektion */}
        <header className="details-header">
          <h2 id="movie-title">{movie.title}</h2>
          
          {/* Visa genomsnittsbetyget uppe till höger */}
          {isMovieReleased(movie.release_date) && movie.imdb_rating && (
            <div className="average-rating">
              {calculateAverageRating(movie.imdb_rating, movie.rt_rating || null, movie.mc_rating || null)?.toFixed(1)}/10
            </div>
          )}
          
          <div className="movie-meta">
            <span className="movie-year">{getReleaseYear(movie.release_date)}</span>
            {"|"}
            <span className="movie-duration">{formatDuration(movie.duration)}</span>
          </div>

          <div className="genre-tags">
            {genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>

          <div className="genre-tags">
            {movie.saga && (
                <span className="phase-tag">{movie.saga}</span>
              )}
          </div>
        </header>

        {/* Betygssektion */}
        <section className="ratings-section">
          <h3 className="section-title">Betyg</h3>

          {isMovieReleased(movie.release_date) ? (
            <div className="ratings-container-inline">
              {movie.imdb_rating && (
                <div className="rating-badge">
                  <h4>IMDB</h4>
                  <span className="rating-icon">⭐</span>
                  <span className="rating-value">{movie.imdb_rating.toFixed(1)}</span>
                </div>
              )}
              
              {movie.rt_rating && (
                <div className="rating-badge">
                  <h4>Rotten Tomatoes</h4>
                  <span className="rating-icon">🍅</span>
                  <span className="rating-value">{movie.rt_rating}%</span>
                </div>
              )}
              
              {movie.mc_rating && (
                <div className="rating-badge">
                  <h4>Metacritic</h4>
                  <span className="rating-icon">📊</span>
                  <span className="rating-value">{movie.mc_rating}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="coming-soon">
              <p>Coming soon...</p>
            </div>
          )}
        </section>
        
        
        
        {/* About the movie section */}
        <section className="about-movie-section">
          {/* Horisontell linje före About the movie */}
          <div className="section-divider"></div>
          <h3 className="section-title">About the movie</h3>
          <p>{movie.overview || "Ingen beskrivning tillgänglig."}</p>
        </section>

        {/* Trailer-sektion */}
        {movie.trailer_url && (
          <section className="trailer-section">
            <h3 className="section-title">Trailer</h3>
            <figure className="trailer-container">
              <iframe
                src={movie.trailer_url.replace('watch?v=', 'embed/')}
                title={`${movie.title} trailer`}
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