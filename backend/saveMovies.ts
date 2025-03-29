import axios from "axios";
import { executeQuery } from "../api/db";
import { Movie } from "../src/types/movie";

export async function fetchAndSaveMovies() {
  try {
    // API-anrop till MCU API
    const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
    const movies: Movie[] = response.data.data;
    
    console.log(`Hämtade ${movies.length} filmer från MCU API`);
    
    // Bestäm om vi kör i Vercel (PostgreSQL) eller lokalt (MySQL)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    // Loop genom alla filmer och spara dem
    for (const movie of movies) {
      console.log(`Sparar film: ${movie.title}`);
      
      if (isProduction) {
        // PostgreSQL på Vercel
        await executeQuery(
          `INSERT INTO movies (
            id, title, release_date, box_office, duration, overview, cover_url, trailer_url, directed_by, phase, saga, imdb_rating, rt_rating, mc_rating
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            release_date = EXCLUDED.release_date
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
            movie.imdb_rating,
            movie.rotten_tomatoes_rating,
            movie.metacritic_rating,
          ]
        );
      } else {
        // MySQL lokalt
        await executeQuery(
          `INSERT INTO movies (
            id, title, release_date, box_office, duration, overview, cover_url, trailer_url, directed_by, phase, saga, imdb_rating, rt_rating, mc_rating
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            release_date = VALUES(release_date)
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
            movie.imdb_rating,
            movie.rotten_tomatoes_rating,
            movie.metacritic_rating,
          ]
        );
      }
    }

    console.log("Filmerna är nu sparade i databasen.");
  } catch (err: any) { // 'any' för att lösa typproblemet
    console.error("Fel vid sparning:", err);
  }
}

// Uncomment för att köra funktionen direkt när scriptet körs
// fetchAndSaveMovies();