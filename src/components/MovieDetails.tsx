// src/components/MovieDetails.tsx
import React, { useRef, useEffect } from 'react';
import { Movie, MovieDetailsProps } from '../types/movie';


/** funktionell komponent dom tar två destrukerade props */
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
    return `${hours}h ${mins}m`; /** ${} gör att vi kan bädda in variabler 
    i en sträng utan att använda + för bygga mening */
  };

  return (
    <aside className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="movie-title">
  <article className="movie-details" ref={modalRef}>

        {/**Titel och stäng-knapp */}
        <header className="details-header">
          <h2 id="movie-title">{movie.title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Stäng detaljer">
            × {/** stänger modalen, bara en visuell knapp, kan lika gärna stå "stäng" */}
          </button>
        </header>
        
        <section className="details-content"> {/**Innehåller filmposter och info om film */}

          {/** Visar filmpostern */}
          <figure className="details-poster">
            {movie.cover_url ? ( // Om movie.cover_url finns, visas bilden annars figcaption
              <img src={movie.cover_url} alt={`Filmposter för ${movie.title}`} />
            ) : (
              <figcaption className="no-poster">Ingen bild tillgänglig</figcaption>
            )}
          </figure>
          
          <section className="details-info">
            {/** Visar detaljerad filmfakta 
             * dl = definition list ( par av termer och innehåll/beskrvning.)
             * dt = definition term (rubrik), dd = definition data (innehåll)
            */}
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
          {/** Visar handling om filmen om filmen har en ovierview */}
          <h3>Handling</h3>
          <p>{movie.overview || "Ingen beskrivning tillgänglig."}</p>
        </section>
        
        {movie.trailer_url && (
          <section className="trailer-section">
            <h3>Trailer</h3>
            <figure className="trailer-container">
              <iframe //attribut nedan
                src={movie.trailer_url.replace('watch?v=', 'embed/')} 
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                /** kommer från YouTube's inbäddningskod eller andra videoplattformars 
                 *  iframe-inställningar, vilket styr vad som är tillåtet i videospelaren. */
                allowFullScreen // Gör det möjligt att spela upp trailern i helskärmsläge.
              ></iframe>
            </figure>
          </section>
        )}
      </article>
    </aside>
  );
};

export default MovieDetails;