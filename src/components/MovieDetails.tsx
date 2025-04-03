import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Movie, MovieDetailsProps } from '../types/movie';
import '../CSS/MovieDetails.css';

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  const [movieRatings, setMovieRatings] = useState<{
    imdbRating?: number | null,
    rtRating?: number | null,
    mcRating?: number | null
  }>({
    imdbRating: movie.imdb_rating,
    rtRating: movie.rt_rating,
    mcRating: movie.mc_rating
  });

  // Hämta betyg från OMDb API om de saknas
  useEffect(() => {
    const fetchMovieRatings = async () => {
      // Kontrollera om någon rating saknas
      if (
        movieRatings.imdbRating === null || 
        movieRatings.rtRating === null || 
        movieRatings.mcRating === null
      ) {
        try {
          const response = await axios.get('http://www.omdbapi.com/', {
            params: {
              apikey: OMDB_API_KEY,
              t: movie.title,
              y: new Date(movie.release_date).getFullYear()
            }
          });

          const data = response.data;
          const updatedRatings = { ...movieRatings };
          
          // Uppdatera bara saknade betyg
          if (!updatedRatings.imdbRating && data.imdbRating) {
            updatedRatings.imdbRating = parseFloat(data.imdbRating);
          }

          // Rotten Tomatoes
          if (!updatedRatings.rtRating) {
            const rtRating = data.Ratings?.find((r: any) => r.Source === 'Rotten Tomatoes');
            if (rtRating) {
              updatedRatings.rtRating = parseInt(rtRating.Value);
            }
          }

          // Metacritic
          if (!updatedRatings.mcRating && data.Metascore) {
            updatedRatings.mcRating = parseInt(data.Metascore);
          }

          setMovieRatings(updatedRatings);
        } catch (error) {
          console.error('Kunde inte hämta betyg:', error);
        }
      }
    };

    // Körs endast om miljövariabeln för OMDb API finns (vilket bara är sant på Vercel)
    if (OMDB_API_KEY) {
      fetchMovieRatings();
    }
  }, [movie.title, movie.release_date, OMDB_API_KEY]);

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
  const calculateAverageRating = (): number | null => {
    const { imdbRating, rtRating, mcRating } = movieRatings;
    
    const ratings = [
      imdbRating,
      rtRating ? rtRating / 10 : null,
      mcRating ? mcRating / 10 : null
    ].filter((rating): rating is number => rating !== null && rating !== undefined);

    if (ratings.length === 0) return null;

    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return parseFloat(averageRating.toFixed(1));
  };

  const ratingValue = calculateAverageRating();

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
          {isMovieReleased(movie.release_date) && ratingValue && (
            <div className="average-rating">
              {ratingValue.toFixed(1)}/10
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
              {movieRatings.imdbRating !== null && movieRatings.imdbRating !== undefined && (
                <div className="rating-badge">
                  <h4>IMDB</h4>
                  <span className="rating-icon">⭐</span>
                  <span className="rating-value">{movieRatings.imdbRating.toFixed(1)}</span>
                </div>
              )}
              
              {movieRatings.rtRating !== null && movieRatings.rtRating !== undefined && (
                <div className="rating-badge">
                  <h4>Rotten Tomatoes</h4>
                  <span className="rating-icon">🍅</span>
                  <span className="rating-value">{movieRatings.rtRating}%</span>
                </div>
              )}
              
              {movieRatings.mcRating !== null && movieRatings.mcRating !== undefined && (
                <div className="rating-badge">
                  <h4>Metacritic</h4>
                  <span className="rating-icon">📊</span>
                  <span className="rating-value">{movieRatings.mcRating}</span>
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