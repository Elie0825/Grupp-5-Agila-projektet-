import React, { useEffect, useRef, useState } from 'react';
import { Movie } from '../types/movie';
import { MarvelCharacters } from '../types/character';
import '../css/MovieDetails.css';
import { fetchMarvelCharacters } from '../services/characterApi';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  onCharacterClick?: (character: MarvelCharacters) => void;
  movies?: Movie[]; // Ny prop för att få tillgång till alla filmer
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ 
  movie, 
  onClose, 
  onCharacterClick,
  movies = [] // Default tom array
}) => {
  const [characters, setCharacters] = useState<MarvelCharacters[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailerError, setTrailerError] = useState(false);
  
  // Hämta karaktärer när komponenten laddas
  useEffect(() => {
    const getCharacters = async () => {
      try {
        const allCharacters = await fetchMarvelCharacters();
        setCharacters(allCharacters);
      } catch (error) {
        console.error('Fel vid hämtning av karaktärer:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getCharacters();
  }, []);
  
  // Filtrera karaktärer som medverkar i den aktuella filmen med förbättrad matchningslogik
  const charactersInMovie = characters.filter(character => 
    character.movies.some(movieTitle => {
      // Exakt matchning av filmtitel
      if (movieTitle === movie.title) {
        return true;
      }
      
      // Hantera specialfall för titlar med parenteser (t.ex. cameos, post-credits)
      if (movieTitle.includes('(') && movieTitle.split(' (')[0] === movie.title) {
        return true;
      }
      
      // Hantera särskilda fall där filmtiteln kan vara delvis annorlunda
      // Till exempel: "Avengers: Infinity War" kan ibland anges som bara "Infinity War"
      // Kontrollera att den kortare titeln inte matchar andra filmer
      const movieParts = movie.title.split(': ');
      if (movieParts.length > 1) {
        const shortTitle = movieParts[1];
        // Kontrollera att det är en substantiell del av titeln (undvik korta delar som "The")
        if (shortTitle.length > 5 && movieTitle === shortTitle) {
          // Kontrollera att detta inte skulle matcha andra filmer med samma suffix
          const otherSimilarMovies = movies.filter(m => 
            m.id !== movie.id && m.title.includes(shortTitle)
          );
          if (otherSimilarMovies.length === 0) {
            return true;
          }
        }
      }
      
      return false;
    })
  );
  
  // Formatera releasedatum till läsbart format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };

  // Refs och event listeners för modal
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Formatera speltid
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

  // Förhindra scrollning
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
  
  // Hantera klick på en karaktär
  const handleCharacterCardClick = (character: MarvelCharacters) => (e: React.MouseEvent) => {
    e.stopPropagation(); // Förhindra att modal stängs
    if (onCharacterClick) {
      onCharacterClick(character);
      onClose(); // Stäng filmdetaljer när man öppnar karaktärsdetaljer
    }
  };

  // Hantera fel vid laddning av trailer
  const handleTrailerError = () => {
    setTrailerError(true);
  };

  // Kontrollera om trailer-url är en giltig YouTube-länk som kan inbäddas
  const isValidYouTubeUrl = (url: string | null): boolean => {
    if (!url) return false;
    
    // Kontrollera om det är en YouTube-länk som kan inbäddas
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Konvertera YouTube-url till inbäddningslänk
  const getEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('brightcove.net')) {
      // Returnera länken som den är för Brightcove
      return url;
    }
    
    // Fallback - returnera ursprunglig länk
    return url;
  };

  // Fiktiva genres
  const genres = ['Sci-Fi', 'Superhero', 'Action', 'Adventure'];

  // Beräkna genomsnittsbetyg från filmens befintliga data
  const calculateAverageRating = (): number | null => {
    const ratings = [
      movie.imdb_rating,
      movie.rt_rating ? movie.rt_rating / 10 : null,
      movie.mc_rating ? movie.mc_rating / 10 : null
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
          <div className="title-rating-wrapper">
            <h2 id="movie-title">{movie.title}</h2>
            
            {/* Visa genomsnittsbetyget */}
            {isMovieReleased(movie.release_date) && ratingValue && (
              <div className="average-rating">
                {ratingValue.toFixed(1)}/10
              </div>
            )}
          </div>
          
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

        {/* Betygssektion - nu med data från JSON */}
        <section className="ratings-section">
          <h3 className="section-title">Betyg</h3>

          {isMovieReleased(movie.release_date) ? (
          <div className="ratings-container-inline">
            {movie.imdb_rating && (
              <div className="rating-badge">
                <img src="/imdb-logo.png" alt="IMDB logo" className="rating-logo" />
                <div className="rating-value">{Number(movie.imdb_rating).toFixed(1)}/10</div>
                <h4 className="rating-name">IMDb</h4>
              </div>
            )}
            
            {movie.rt_rating && (
              <div className="rating-badge">
                <img src="/rt-logo.png" alt="Rotten Tomatoes logo" className="rating-logo" />
                <div className="rating-value">{Number(movie.rt_rating)}%</div>
                <h4 className="rating-name">Rotten Tomatoes</h4>
              </div>
            )}
            
            {movie.mc_rating && (
              <div className="rating-badge">
                <img src="/mt-logo.png" alt="Metacritic logo" className="rating-logo" />
                <div className="rating-value">{Number(movie.mc_rating)}</div>
                <h4 className="rating-name">Metacritic</h4>
              </div>
            )}
          </div>
        ) : (
          <div className="coming-soon">
            <p>Coming soon...</p>
          </div>
        )}
        </section>
        
        {/* Övrig information från databasen */}
        <section className="about-movie-section">
          <div className="section-divider"></div>
          <h3 className="section-title">About the movie</h3>
          <p>{movie.overview || "Ingen beskrivning tillgänglig."}</p>
        </section>

        {/* Trailer-sektion med fallback */}
        {movie.trailer_url && (
          <section className="trailer-section">
            <div className="section-divider"></div>
            <h3 className="section-title">Trailer</h3>
            
            {!trailerError ? (
              <figure className="trailer-container">
                <iframe
                  src={getEmbedUrl(movie.trailer_url)}
                  title={`${movie.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={handleTrailerError}
                  onLoad={() => setTrailerError(false)}
                ></iframe>
              </figure>
            ) : (
              <div className="trailer-fallback">
                <p>Trailern kunde inte laddas.</p>
                <a 
                  href={movie.trailer_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="trailer-button"
                >
                  Öppna trailer i ny flik
                </a>
              </div>
            )}
          </section>
        )}
        
        {/* Karaktärssektion */}
        {!loading && charactersInMovie.length > 0 && (
          <section className="characters-section">
            <div className="section-divider"></div>
            <h3 className="section-title">Karaktärer i filmen</h3>
            
            <div className="movie-characters-grid">
              {charactersInMovie.map((character) => (
                <div 
                  key={character.id} 
                  className="movie-character-card"
                  onClick={onCharacterClick ? handleCharacterCardClick(character) : undefined}
                  style={onCharacterClick ? { cursor: 'pointer' } : {}}
                >
                  <div className="character-avatar-container">
                    <img 
                      src={character.image_url} 
                      alt={character.name} 
                      className="character-avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-character.jpg';
                      }}
                    />
                  </div>
                  <h4 className="character-name">{character.name}</h4>
                  {character.real_name !== character.name && (
                    <p className="character-real-name">{character.real_name}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </aside>
  );
};

export default MovieDetails;