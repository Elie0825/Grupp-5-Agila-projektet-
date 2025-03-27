// src/services/api.ts
import { Movie, Root } from '../types/movie';

/**
 * Hämtar alla Marvel-filmer via proxy
 * returns En array med Marvel-filmer
 */
export const fetchMarvelMovies = async (): Promise<Movie[]> => { /**funktionen 
  returnerar en lista med Movie-objekt */
  try {
    console.log("Anropar MCU API via proxy...");
    const response = await fetch("/api/movies"); /** GET-anrop till en proxy-endpoint. */
    /**Istället för att anropa en extern URL används en proxy för att undvika CORS-problem. */
    
    if (!response.ok) {
      throw new Error(`API svarade med status: ${response.status}`);
    }
    
    /** Vi ser till att datan från API:et följer strukturen i 
     * interfacet Root, så TypeScript kan hantera den korrekt 
     * och ge oss typkontroll och autokomplettering */
    const moviesResponse: Root = await response.json();
    console.log(`Hämtade ${moviesResponse.data.length} filmer från MCU API`);
    
    /** moviesResponse innehåller hela API-svaret och har typen Root. */

    return moviesResponse.data;
    /** return moviesResponse.data; skickar tillbaka en lista av 
     * filmer till App.tsx, där den lagras i useState(movies). */

  } catch (error) {
    console.error("API-fel:", error);
    return [];
  }
};