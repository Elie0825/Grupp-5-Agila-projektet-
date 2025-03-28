import axios from "axios";
import { getClient } from "./db"; // Hämtar en klient från vår pool
import { Movie } from "../src/types/movie";

// Funktion som hämtar filmer från MCU API och sparar i databasen
export async function fetchAndSaveMovies() {
  // API-anrop till MCU API
  const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
  const movies: Movie[] = response.data.data;

  // Hämtar en databas-klient
  const client = await getClient();

  try {
    // Loopar igenom varje film och sparar den i databasen
    for (const movie of movies) {
      console.log(`Sparar film: ${movie.title}`);

      await client.query(
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
    }

    console.log("Filmerna är nu sparade i databasen.");
  } catch (err) {
    console.error("Fel vid sparning:", err);
  } finally {
    // Släpper anslutningen tillbaka till poolen
    client.release();
  }
}

// Startar funktionen direkt när scriptet körs
fetchAndSaveMovies();
