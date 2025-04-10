import { Movie } from '../types/movie';

/**
 * Hämtar Marvel-filmer från lokal JSON-fil
 * @returns Promise som resolvar till en array av filmdata
 */
export const fetchMarvelMovies = async (): Promise<Movie[]> => {
  try {
    console.log('[API] Försöker hämta filmer från marvelmovies.json');
    
    // Viktigt: Se till att hämta från rätt sökväg och med rätt caching-inställningar
    const response = await fetch('/marvelmovies.json', { 
      cache: 'no-store',  // Viktigt: Förhindra caching av gamla data
      headers: { 
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error(`[API] HTTP-fel vid hämtning: ${response.status} ${response.statusText}`);
      throw new Error(`Kunde inte hämta filmer: ${response.status} ${response.statusText}`);
    }
    
    const rawData = await response.json();
    console.log(`[API] Hämtade rådata: ${rawData.length} objekt`);
    
    // Logga de första och sista objekten för att se strukturen
    if (rawData.length > 0) {
      console.log('[API] Första objektets struktur:', 
        Object.keys(rawData[0]).map(key => `${key}: ${typeof rawData[0][key]}`).join(', ')
      );
    }

    // Validera men behåll så många filmer som möjligt 
    const validMovies = rawData.filter((movie: any, index: number) => {
      // Minimala valideringskrav - bara se till att id och title finns
      const isValid = movie && typeof movie === 'object' && 
                      typeof movie.id === 'number' && 
                      typeof movie.title === 'string';
      
      if (!isValid) {
        console.error(`[API] Ogiltig film på index ${index}:`, movie);
      } else {
        // Kontrollera och logga om de viktiga fälten saknas men filtrerar inte bort filmen
        const missingFields = [];
        if (movie.release_date === undefined) missingFields.push('release_date');
        if (movie.duration === undefined) missingFields.push('duration');
        if (movie.chronology === undefined) missingFields.push('chronology');
        if (movie.phase === undefined) missingFields.push('phase');
        
        if (missingFields.length > 0) {
          console.warn(`[API] Film "${movie.title}" saknar fält (men visas ändå): ${missingFields.join(', ')}`);
        }
      }
      
      return isValid;
    });
    
    console.log(`[API] Efter validering: ${validMovies.length} av ${rawData.length} filmer är giltiga`);
    
    // Lägg till beräkningsfunktionen för genomsnittsbetyg
    const moviesWithCalculation = validMovies.map((movie: any) => {
      return {
        ...movie,
        calculateAverageRating: function() {
          const ratings = [
            this.imdb_rating,
            this.rt_rating ? this.rt_rating / 10 : null,
            this.mc_rating ? this.mc_rating / 10 : null
          ].filter((rating): rating is number => rating !== null && rating !== undefined);

          if (ratings.length === 0) return null;
          return parseFloat((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1));
        }
      };
    });
    
    return moviesWithCalculation;
  } catch (error) {
    console.error('[API] Fel vid hämtning av filmer:', error);
    throw error;
  }
};

/**
 * Hämtar en specifik Marvel-film baserat på ID
 * @param movieId ID för filmen att hämta
 * @returns Promise som resolvar till filmen eller null om den inte hittas
 */
export const fetchMovieById = async (movieId: number): Promise<Movie | null> => {
  try {
    const allMovies = await fetchMarvelMovies();
    return allMovies.find(movie => movie.id === movieId) || null;
  } catch (error) {
    console.error(`Fel vid hämtning av film med ID ${movieId}:`, error);
    return null;
  }
};