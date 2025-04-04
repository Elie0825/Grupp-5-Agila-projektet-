import axios from 'axios';
import { Movie } from '../types/movie';

// Definiera isLocalhost
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// OMDb API-nyckel
const OMDB_API_KEY = "8f57b2c1";

// Hjälpfunktion för att hämta betyg från OMDb för en film
const fetchRatingsFromOMDb = async (movie: Movie): Promise<Movie> => {
  try {
    // Använd filmens titel och år för sökning
    const year = new Date(movie.release_date).getFullYear();
    const query = encodeURIComponent(movie.title);
    
    console.log(`Söker efter "${movie.title}" (${year}) på OMDb...`);
    const omdbResponse = await axios.get(`https://www.omdbapi.com/?t=${query}&y=${year}&apikey=${OMDB_API_KEY}`);
    
    let imdb_rating = movie.imdb_rating; // Behåll befintligt betyg om det finns
    let rt_rating = movie.rt_rating;
    let mc_rating = movie.mc_rating;
    
    if (omdbResponse.data && omdbResponse.data.Response === "True") {
      // Hämta IMDb-betyg
      if (omdbResponse.data.imdbRating && omdbResponse.data.imdbRating !== "N/A") {
        imdb_rating = parseFloat(omdbResponse.data.imdbRating);
      }
      
      // Hämta övriga betyg från Ratings-arrayen
      if (omdbResponse.data.Ratings && Array.isArray(omdbResponse.data.Ratings)) {
        for (const rating of omdbResponse.data.Ratings) {
          if (rating.Source === "Rotten Tomatoes" && rating.Value) {
            // Konvertera "75%" till 75
            rt_rating = parseInt(rating.Value.replace("%", ""));
          } else if (rating.Source === "Metacritic" && rating.Value) {
            // Konvertera "75/100" till 75
            mc_rating = parseInt(rating.Value.split("/")[0]);
          }
        }
      }
      
      console.log(`Betyg för "${movie.title}": IMDb: ${imdb_rating}, RT: ${rt_rating}, MC: ${mc_rating}`);
    } else {
      console.log(`Ingen träff på OMDb för "${movie.title}"`);
    }
    
    return {
      ...movie,
      imdb_rating,
      rt_rating,
      mc_rating
    };
    
  } catch (error) {
    console.error(`Fel vid hämtning av betyg för "${movie.title}":`, error.message);
    return movie; // Returnera originalfilmen om något går fel
  }
};

// Kontrollera om en film har betyg
const hasRatings = (movie: Movie): boolean => {
  return movie.imdb_rating !== null && 
         movie.imdb_rating !== undefined;
};

export const fetchMarvelMovies = async (): Promise<Movie[]> => {
  try {
    if (isLocalhost) {
      // Lokalt: hämta direkt från MCU API
      const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
      console.log("🎬 Hämtar filmer direkt från MCU API");
      
      // För lokal utveckling - om vi vill ha dummybetyg
      const moviesWithDummyRatings: Movie[] = response.data.data.map((movie: Movie) => ({
        ...movie,
        imdb_rating: Math.floor(Math.random() * 20 + 65) / 10, // 6.5-8.5
        rt_rating: Math.floor(Math.random() * 20) + 75, // 75-95%
        mc_rating: Math.floor(Math.random() * 20) + 70 // 70-90
      }));
      
      console.log("Exempel på film med betyg:", moviesWithDummyRatings[0]);
      return moviesWithDummyRatings;
    } else {
      // På Vercel: hämta från backend som hämtar från databasen
      try {
        console.log("🎬 Försöker hämta filmer från vår databas...");
        const response = await axios.get("/api/movies");
        
        // Logga detaljer om svaret
        console.log(`🎬 Hämtade ${response.data.data.length} filmer från backend/databas`);
        
        // Kontrollera om betygsfälten finns
        const firstMovie = response.data.data[0];
        console.log("Första filmen från databasen:", firstMovie);
        console.log("Finns betyg i filmen?", {
          imdb_rating: firstMovie.imdb_rating !== undefined,
          rt_rating: firstMovie.rt_rating !== undefined,
          mc_rating: firstMovie.mc_rating !== undefined
        });
        
        // Kontrollera hur många filmer som har betyg
        const moviesWithRatings = response.data.data.filter((m: Movie) => hasRatings(m));
        console.log(`Filmer med betyg: ${moviesWithRatings.length} av ${response.data.data.length}`);
        
        // Om vi saknar betyg för vissa filmer, hämta dem från OMDb
        if (moviesWithRatings.length < response.data.data.length) {
          console.log("⚠️ Vissa filmer saknar betyg, försöker hämta från OMDb API...");
          
          // Identifiera filmer som saknar betyg
          const moviesWithoutRatings: Movie[] = response.data.data.filter((m: Movie) => !hasRatings(m));
          
          // Begränsa till max 10 filmer per laddning för att spara på API-anrop
          const filmsToUpdate = moviesWithoutRatings.slice(0, 10);
          
          if (filmsToUpdate.length > 0) {
            console.log(`Hämtar betyg för ${filmsToUpdate.length} filmer från OMDb...`);
            
            // Hämta betyg för varje film - max 3 samtidigt för att inte överbelasta API:et
            const enrichedMovies: Movie[] = [];
            
            for (let i = 0; i < filmsToUpdate.length; i++) {
              const enrichedMovie = await fetchRatingsFromOMDb(filmsToUpdate[i]);
              
              // Vänta lite mellan anrop för att inte överbelasta API:et
              await new Promise(resolve => setTimeout(resolve, 200)); 
              
              enrichedMovies.push(enrichedMovie);
            }
            
            // Ersätt de filmer som saknade betyg med de berikade versionerna
            const updatedMovies = response.data.data.map((movie: Movie) => {
              const enriched = enrichedMovies.find(m => m.id === movie.id);
              return enriched || movie;
            });
            
            console.log(`🎬 Returnerar ${updatedMovies.length} filmer med betyg från både databas och OMDb`);
            return updatedMovies;
          }
        }
        
        return response.data.data;
      } catch (err: any) {
        // Om databasen inte svarar, fallback till MCU API
        console.warn("⚠️ Databasfel, använder fallback till MCU API", err.message);
        const fallbackResponse = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
        
        console.log("Fallback: Första filmen från MCU API:", fallbackResponse.data.data[0]);
        console.log("⚠️ MCU API har inga betygsfält, försöker hämta från OMDb...");
        
        // Hämta betyg för filmer från MCU API - begränsa till första 10 för att spara API-anrop
        const filmsToEnrich = fallbackResponse.data.data.slice(0, 10);
        const enrichedMovies: Movie[] = [];
        
        for (let i = 0; i < filmsToEnrich.length; i++) {
          const enrichedMovie = await fetchRatingsFromOMDb(filmsToEnrich[i]);
          
          // Vänta lite mellan anrop för att inte överbelasta API:et
          await new Promise(resolve => setTimeout(resolve, 200)); 
          
          enrichedMovies.push(enrichedMovie);
        }
        
        // Kombinera berikade filmer med resten av filmerna
        const allMovies = [
          ...enrichedMovies,
          ...fallbackResponse.data.data.slice(10)
        ];
        
        console.log(`🎬 Returnerar ${allMovies.length} filmer med betyg från fallback till OMDb`);
        return allMovies;
      }
    }
  } catch (error: any) {
    console.error("❌ Alla försök att hämta filmer misslyckades:", error);
    throw error;
  }
};