// Ladda miljövariabler från .env-filen
import dotenv from 'dotenv';
dotenv.config();

// Importera axios för API-anrop
import axios from 'axios';
// Importera PostgreSQL-poolen från db.ts
import pool from './db';
// Importera Movie-typ från dina typer
import { Movie } from '../src/types/movie';

async function fetchAndSaveMovies() {
  // Skapa databasanslutning från poolen
  const client = await pool.connect();

  try {
    // Gör API-anropet till MCU API
    const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
    const movies: Movie[] = response.data.data;

    // Loopa igenom varje film
    for (const movie of movies) {
      try {
        console.log(`Sparar film: ${movie.title}`); // Logga aktuell film

        // INSERT med ON CONFLICT (id) för att uppdatera om filmen redan finns
        await client.query(
          `INSERT INTO movies 
          (id, title, release_date, box_office, duration, overview, cover_url, trailer_url, directed_by, phase, saga, chronology, post_credit_scenes, imdb_id, updated_at)
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          )
          ON CONFLICT (id) DO UPDATE SET 
            title = EXCLUDED.title,
            release_date = EXCLUDED.release_date,
            box_office = EXCLUDED.box_office,
            duration = EXCLUDED.duration,
            overview = EXCLUDED.overview,
            cover_url = EXCLUDED.cover_url,
            trailer_url = EXCLUDED.trailer_url,
            directed_by = EXCLUDED.directed_by,
            phase = EXCLUDED.phase,
            saga = EXCLUDED.saga,
            chronology = EXCLUDED.chronology,
            post_credit_scenes = EXCLUDED.post_credit_scenes,
            imdb_id = EXCLUDED.imdb_id,
            updated_at = EXCLUDED.updated_at`,
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
              ? new Date(movie.updated_at).toISOString()
              : new Date().toISOString()
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
    // Släpp anslutningen tillbaka till poolen oavsett resultat
    client.release();
  }
}

// Starta funktionen
fetchAndSaveMovies();
