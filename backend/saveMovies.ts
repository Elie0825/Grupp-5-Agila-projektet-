import axios from "axios";
import { executeQuery } from "../api/db";
import { Movie } from "../src/types/movie";

// OMDb API-nyckel
const OMDB_API_KEY = "8f57b2c1";

export async function fetchAndSaveMovies() {
  try {
    // Steg 1: Hämta grunddata från MCU API (som innan)
    console.log("Hämtar filmer från MCU API...");
    const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
    const movies: Movie[] = response.data.data;
    console.log(`Hämtade ${movies.length} filmer från MCU API`);
    
    // Steg 2: Berika med betyg från OMDb
    const enrichedMovies = [];
    
    for (const movie of movies) {
      console.log(`Bearbetar film: ${movie.title}`);
      
      // Hämta betyg från OMDb API
      let imdb_rating = null;
      let rt_rating = null;
      let mc_rating = null;
      
      try {
        // Använd filmens titel och år för sökning
        const year = new Date(movie.release_date).getFullYear();
        const query = encodeURIComponent(movie.title);
        
        console.log(`Söker efter "${movie.title}" (${year}) på OMDb...`);
        const omdbResponse = await axios.get(`https://www.omdbapi.com/?t=${query}&y=${year}&apikey=${OMDB_API_KEY}`);
        
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
      } catch (error: any) {
        console.error(`Fel vid hämtning av betyg för "${movie.title}":`, error.message);
      }
      
      // Vänta lite så vi inte överbelastar API:et (max 1000 req/dag)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Lägg till betyg till filmen
      enrichedMovies.push({
        ...movie,
        imdb_rating,
        rt_rating,
        mc_rating
      });
    }
    
    // Steg 3: Spara berikade filmer i databasen
    console.log("Sparar berikade filmer i databasen...");
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    for (const movie of enrichedMovies) {
      if (isProduction) {
        // PostgreSQL (Vercel)
        await executeQuery(
          `INSERT INTO movies (
            id, title, release_date, box_office, duration, overview, cover_url, 
            trailer_url, directed_by, phase, saga, imdb_id, 
            imdb_rating, rt_rating, mc_rating
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            release_date = EXCLUDED.release_date,
            imdb_rating = EXCLUDED.imdb_rating,
            rt_rating = EXCLUDED.rt_rating,
            mc_rating = EXCLUDED.mc_rating
          `,
          [
            movie.id,
            movie.title,
            movie.release_date,
            movie.box_office,
            movie.duration,
            movie.overview,
            movie.cover_url,
            movie.trailer_url,
            movie.directed_by,
            movie.phase,
            movie.saga,
            movie.imdb_id,
            movie.imdb_rating,
            movie.rt_rating,
            movie.mc_rating
          ]
        );
      } else {
        // MySQL (lokalt)
        await executeQuery(
          `INSERT INTO movies (
            id, title, release_date, box_office, duration, overview, cover_url, 
            trailer_url, directed_by, phase, saga, imdb_id, 
            imdb_rating, rt_rating, mc_rating
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            release_date = VALUES(release_date),
            imdb_rating = VALUES(imdb_rating),
            rt_rating = VALUES(rt_rating),
            mc_rating = VALUES(mc_rating)
          `,
          [
            movie.id,
            movie.title,
            movie.release_date,
            movie.box_office,
            movie.duration,
            movie.overview,
            movie.cover_url,
            movie.trailer_url,
            movie.directed_by,
            movie.phase,
            movie.saga,
            movie.imdb_id,
            movie.imdb_rating,
            movie.rt_rating,
            movie.mc_rating
          ]
        );
      }
    }

    console.log("Filmerna har sparats i databasen med betyg!");
  } catch (error) {
    console.error("Fel vid hämtning eller sparning av filmer:", error);
  }
}

// Kör funktionen direkt när scriptet körs
fetchAndSaveMovies().then(() => {
  console.log("Script avslutat.");
  process.exit(0); // Avsluta skriptet när allt är klart
}).catch((error) => {
  console.error("Fel vid körning av skriptet:", error);
  process.exit(1); // Avsluta med felkod
});
