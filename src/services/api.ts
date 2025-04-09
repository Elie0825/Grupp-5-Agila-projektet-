import { Movie } from '../types/movie';

/**
 * Hämtar Marvel-filmer från lokal JSON-fil
 * @returns Promise som resolvar till en array av filmdata
 */
export const fetchMarvelMovies = async (): Promise<Movie[]> => {
  console.group('📥 Hämtar Marvel-filmer');
  try {
    console.log('Hämtar från /marvelmovies.json');
    
    const response = await fetch('/marvelmovies.json');
    if (!response.ok) {
      throw new Error(`HTTP-fel: ${response.status} ${response.statusText}`);
    }
    
    const rawData = await response.json();
    console.log(`Hämtade ${rawData.length} objekt från JSON-filen`);
    
    // Validera film-objekten
    const validMovies = validateMovies(rawData);
    console.log(`Validerade filmer: ${validMovies.length} av ${rawData.length} är giltiga`);
    
    // Lägg till beräkningsfunktionen för genomsnittsbetyg
    const movies: Movie[] = validMovies.map((movie: Movie) => {
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
    
    console.log(`Returnerar ${movies.length} filmer`);
    console.groupEnd();
    return movies;
    
  } catch (error) {
    console.error('Fel vid hämtning av filmer:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * Validerar en array av filmobjekt
 * @param movies Array av rådata att validera
 * @returns Array av validerade Movie-objekt
 */
function validateMovies(movies: any[]): Movie[] {
  return movies.filter((movie: any, index: number) => {
    // Kontrollera nödvändiga fält
    const isValid = movie && 
                   typeof movie === 'object' && 
                   typeof movie.id === 'number' &&
                   typeof movie.title === 'string' &&
                   typeof movie.release_date === 'string' &&
                   typeof movie.duration === 'number' &&
                   typeof movie.chronology === 'number' &&
                   typeof movie.phase === 'number';
    
    if (!isValid) {
      console.warn(`Ogiltig film på index ${index}:`, movie);
      
      // Logga specifika problem för diagnostik
      if (!movie) {
        console.error('Film är null eller undefined');
      } else {
        if (typeof movie.id !== 'number') console.error(`Film "${movie.title || 'Utan titel'}" har ogiltig id: ${movie.id}`);
        if (typeof movie.title !== 'string') console.error(`Film ID ${movie.id || 'okänd'} har ogiltig titel: ${movie.title}`);
        if (typeof movie.release_date !== 'string') console.error(`Film "${movie.title || 'Utan titel'}" har ogiltigt release-datum: ${movie.release_date}`);
        if (typeof movie.duration !== 'number') console.error(`Film "${movie.title || 'Utan titel'}" har ogiltig duration: ${movie.duration}`);
        if (typeof movie.chronology !== 'number') console.error(`Film "${movie.title || 'Utan titel'}" har ogiltig chronology: ${movie.chronology}`);
        if (typeof movie.phase !== 'number') console.error(`Film "${movie.title || 'Utan titel'}" har ogiltig phase: ${movie.phase}`);
      }
    }
    
    return isValid;
  });
}

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