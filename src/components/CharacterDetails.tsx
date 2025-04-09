import React, { useEffect, useRef, useState } from 'react';
import { MarvelCharacters } from '../types/character';
import { Movie } from '../types/movie';
import '../css/CharacterDetails.css';
import '../css/gobackbutton.css'; // Importera den nya CSS-filen

interface CharacterDetailsProps {
  character: MarvelCharacters;
  onClose: () => void;
  movies?: Movie[]; // Alla filmer från applikationen
  onMovieClick?: (movie: Movie) => void; // Funktion för att hantera filmklick
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ 
  character, 
  onClose,
  movies = [], // Default till tom array om inga filmer skickas in
  onMovieClick 
}) => {
  // Fallback-bild om image_url saknas eller är felaktig
  const defaultImage = '/placeholder-character.jpg';
  
  // Tillbaka-knapp state
  const [backToMovieId, setBackToMovieId] = useState<string | null>(null);
  
  // Hämta film att gå tillbaka till från localStorage
  useEffect(() => {
    const savedMovieId = localStorage.getItem("backToMovieId");
    setBackToMovieId(savedMovieId);
  }, []);
  
  const modalRef = useRef<HTMLDivElement>(null);

  /** TILLFÄLLIG DEBUG */
  const debugNavigationState = (action: string) => {
    console.log(`[${action}] Navigation state:`, {
      backToMovieId: localStorage.getItem("backToMovieId"),
      backToCharacterId: localStorage.getItem("backToCharacterId"),
      previousMovieId: localStorage.getItem("previousMovieId"),
      previousCharacterId: localStorage.getItem("previousCharacterId")
    });
  };

  /** TILLFÄLLIG DEBUG */


  // Hämta filmer som karaktären medverkar i
  const getMoviesForCharacter = (characterMovies: string[], allMovies: Movie[]): Movie[] => {
    // Skapa en hjälptabell för att snabbt hitta filmer med ID
    const movieLookup = allMovies.reduce((lookup, movie) => {
      lookup[movie.title] = movie;
      return lookup;
    }, {} as Record<string, Movie>);
    
    // Filtrerar filmer baserat på exakt matchning
    return characterMovies
      .map(movieTitle => {
        // Exakt matchning
        if (movieLookup[movieTitle]) {
          return movieLookup[movieTitle];
        }
        
        // Hantera specialfall för titlar med parenteser (t.ex. cameos, post-credits)
        if (movieTitle.includes('(')) {
          const baseTitle = movieTitle.split(' (')[0];
          if (movieLookup[baseTitle]) {
            return movieLookup[baseTitle];
          }
        }
        
        // Hantera fall där filmtitlar kan vara kortare (t.ex. "Infinity War" istället för "Avengers: Infinity War")
        // men bara om det är unikt nog för att identifiera rätt film
        for (const movie of allMovies) {
          const movieParts = movie.title.split(': ');
          if (movieParts.length > 1) {
            const shortTitle = movieParts[1];
            // Kontrollera att det är en substantiell del av titeln (undvik korta delar)
            if (shortTitle.length > 5 && movieTitle === shortTitle) {
              // Kontrollera att detta inte skulle matcha andra filmer med samma suffix
              const otherSimilarMovies = allMovies.filter(m => 
                m.id !== movie.id && m.title.includes(shortTitle)
              );
              if (otherSimilarMovies.length === 0) {
                return movie;
              }
            }
          }
        }
        
        return null;
      })
      .filter((movie): movie is Movie => movie !== null)
      .sort((a, b) => {
        // Sortera filmerna efter kronologisk ordning om tillgängligt
        if (a.chronology && b.chronology) {
          return a.chronology - b.chronology;
        }
        // Fallback till sortering efter utgivningsdatum
        return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
      });
  };
  
  // Hämta filmerna för denna karaktär
  const characterMovies = getMoviesForCharacter(character.movies, movies);
  
  useEffect(() => {
    // Förhindra scrollning på sidan när detaljvyn är öppen
    document.body.classList.add('modal-open');
    
    // Lägg till en eventlistener för att stänga detaljer när man klickar utanför
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Återställ när komponenten avmonteras
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage;
  };

  const handleClose = () => {
    document.body.classList.remove('modal-open');
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Hantera klick på en film med tillbaka-logik
  const handleMovieClick = (movie: Movie) => {
    debugNavigationState("BEFORE handleMovieClick");
    
    if (onMovieClick) {
      // Spara nuvarande karaktärs-ID för att kunna gå tillbaka till den
      localStorage.setItem("backToCharacterId", character.id.toString());
      
      // Spara tidigare film-ID som "previousMovieId" om det finns ett
      const previousMovieId = localStorage.getItem("backToMovieId");
      if (previousMovieId) {
        localStorage.setItem("previousMovieId", previousMovieId);
      }

      debugNavigationState("AFTER handleMovieClick");
      
      onMovieClick(movie);
      onClose();
    }
  };

  // Hantera tillbaka-knapp
  const handleBackToMovie = () => {
    debugNavigationState("BEFORE handleBackToMovie");
    
    if (backToMovieId && onMovieClick) {
      const movie = movies.find(m => m.id.toString() === backToMovieId);
      if (movie) {
        // Återställ "previousMovieId" till "backToMovieId" om det finns
        const previousId = localStorage.getItem("previousMovieId");
        if (previousId) {
          localStorage.setItem("backToMovieId", previousId);
          localStorage.removeItem("previousMovieId");
        } else {
          // Annars ta bort backToMovieId om det inte finns någon tidigare
          localStorage.removeItem("backToMovieId");
        }
        
        debugNavigationState("AFTER handleBackToMovie");
        
        onMovieClick(movie);
        onClose();
      }
    }
  };

  // Beräkna genomsnittsbetyg för en film
  const calculateAverageRating = (movie: Movie): number | null => {
    const ratings = [
      movie.imdb_rating,
      movie.rt_rating ? movie.rt_rating / 10 : null,
      movie.mc_rating ? movie.mc_rating / 10 : null
    ].filter((rating): rating is number => rating !== null && rating !== undefined);
    
    if (ratings.length === 0) return null;
    
    return parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
  };

  // Dynamiskt generera taggar baserat på karaktären
  const generateCharacterTags = (): string[] => {
    const tags: string[] = [];
    
    // Baserat på filmer karaktären är med i
    const isAvenger = character.movies.some(movie => 
      movie.includes("Avengers") || movie.includes("Captain America: Civil War")
    );
    
    if (isAvenger) tags.push('Avenger');
    
    // Baserat på karaktärens namn eller beskrivning
    if (character.name.includes("Thor") || character.name.includes("Loki") || character.name.includes("Odin")) {
      tags.push('Asgardian');
    }
    
    if (character.name.includes("Groot") || character.name.includes("Rocket") || 
        character.name.includes("Star-Lord") || character.name.includes("Gamora") ||
        character.name.includes("Drax") || character.name.includes("Mantis") ||
        character.name.includes("Nebula")) {
      tags.push('Guardian');
    }
    
    // Standardtaggar om inga specifika hittades
    if (tags.length === 0) {
      tags.push('Hero');
      if (character.real_name !== character.name) {
        tags.push('Superhero');
      }
    }
    
    return tags;
  };

  const characterTags = generateCharacterTags();

  return (
    <aside 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="character-title"
      onClick={handleClose}
    >
      <article className="character-details" onClick={handleModalClick} ref={modalRef}>
        {/* Stängningsknapp - bara en, högst upp till höger */}
        <button className="close-button" onClick={handleClose} aria-label="Stäng detaljer">
          ×
        </button>
        
        {/* Tillbaka-knapp som bara visas om vi kom från en film */}
        {backToMovieId && (
          <button 
            className="go-back-button" 
            onClick={handleBackToMovie}
          >
            Tillbaka till film
          </button>
        )}
        
        {/* Bakgrundsbild med blur */}
        {character.image_url && (
          <div 
            className="details-background" 
            style={{ backgroundImage: `url(${character.image_url})` }} 
            aria-hidden="true"
          />
        )}

        {/* Karaktärsbilden överst */}
        <div className="details-top-section">
          <figure className="details-poster">
            {character.image_url ? (
              <img 
                src={character.image_url} 
                alt={`Bild på ${character.name}`}
                onError={handleImageError}
              />
            ) : (
              <figcaption className="no-poster">Ingen bild tillgänglig</figcaption>
            )}
          </figure>
        </div>

        {/* Titel och metadata */}
        <header className="details-header">
          <h2 id="character-title">{character.name}</h2>
          
          <div className="character-meta">
            {character.real_name && character.real_name !== character.name && (
              <span className="character-real-name">{character.real_name}</span>
            )}
          </div>

          <div className="genre-tags">
            {characterTags.map(tag => (
              <span key={tag} className="genre-tag">{tag}</span>
            ))}
          </div>
        </header>

        {/* Beskrivning */}
        {character.description && (
          <section className="about-character-section">
            <div className="section-divider"></div>
            <h3 className="section-title">Om karaktären</h3>
            <p>{character.description}</p>
          </section>
        )}

        {/* Filmer karaktären medverkar i */}
        {characterMovies.length > 0 && (
          <section className="movies-section">
            <div className="section-divider"></div>
            <h3 className="section-title">Medverkar i</h3>
            
            {/* Viktigt! Se till att hela grid-containern är korrekt positionerad */}
            <div className="character-movies-grid">
              {characterMovies.map((movie) => {
                // Beräkna genomsnittsbetyg för filmen
                const validRatings = [
                  movie.imdb_rating,
                  movie.rt_rating ? movie.rt_rating / 10 : null,
                  movie.mc_rating ? movie.mc_rating / 10 : null
                ].filter((r): r is number => r !== null && r !== undefined);
                
                const ratingValue = validRatings.length > 0
                  ? parseFloat((validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length).toFixed(1))
                  : null;
                
                // Kontrollera om filmen har släppts
                const isReleased = new Date(movie.release_date) <= new Date();
                
                // Korrigera bildsökvägen om den börjar med "public/"
                const getImagePath = (path: string | null | undefined): string => {
                  if (!path) return '/headerbild.svg';
                  return path.replace('public/', '');
                };
                
                return (
                  <article 
                    key={movie.id} 
                    className="character-movie-card"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="movie-poster-container">
                      <img 
                        src={getImagePath(movie.cover_url)} 
                        alt={`Filmposter för ${movie.title}`}
                        className="movie-poster"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/headerbild.svg';
                        }}
                      />
                    </div>
                    
                    {/* Info-sektion med betyg, titel och eventuellt "Coming soon" */}
                    <section className="movie-info">
                      {isReleased && ratingValue !== null ? (
                        <div className="movie-rating">
                          {ratingValue.toFixed(1)}
                        </div>
                      ) : !isReleased && (
                        <span className="coming-soon-card">Coming soon...</span>
                      )}
                      
                      <h3 className="movie-title">{movie.title}</h3>
                    </section>
                  </article>  
                );
              })}
            </div>
          </section>
        )}
        
        {/* Footer */}
        <footer className="details-footer">
          <p className="data-source">Data hämtad från Marvel API</p>
        </footer>
      </article>
    </aside>
  );
};

export default CharacterDetails;