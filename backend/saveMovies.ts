// Importera axios för API-anrop
import axios from 'axios';
// Importera MySQL-anslutningen från din db.ts
import { getConnection } from './db';
// Importera Movie-typ från dina typer
import { Movie } from '../src/types/movie';

async function fetchAndSaveMovies() {
  // Skapa databasanslutning
  const connection = await getConnection();

  try {
    // Gör API-anropet
    const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
    const movies: Movie[] = response.data.data;

    // Loopa igenom varje film
    for (const movie of movies) {
      try {
        console.log(`Sparar film: ${movie.title}`); // Logga aktuell film

        await connection.execute(
          `INSERT INTO movies 
          (id, title, release_date, box_office, duration, overview, cover_url, trailer_url, directed_by, phase, saga, chronology, post_credit_scenes, imdb_id, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title)`,
          [
            movie.id,
            movie.title,
            movie.release_date,
            movie.box_office || "",
            movie.duration || null,
            movie.overview || null,
            movie.cover_url || "",
            movie.trailer_url || "",
            movie.directed_by || "",
            movie.phase || null,
            movie.saga || "",
            movie.chronology || null,
            movie.post_credit_scenes || 0,
            movie.imdb_id,
            movie.updated_at
            ? new Date(movie.updated_at).toISOString().slice(0, 19).replace("T", " ")
            : new Date().toISOString().slice(0, 19).replace("T", " ")

          ]
        );
      } catch (err) {
        // Fel för enskild film
        console.error(`Fel när filmen skulle sparas: ${movie.title}`, err);
      }
    }

    console.log("Filmerna är nu sparade i databasen.");

  } catch (err) {
    // Fel vid API-anrop eller liknande
    console.error("Fel vid hämtning eller sparning:", err);
  } finally {
    await connection.end(); // Stäng anslutningen oavsett om det blev fel eller inte
  }
}

// Starta funktionen
fetchAndSaveMovies();
