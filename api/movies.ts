import { Request, Response } from "express";
import { executeQuery } from "./db";
import { Movie } from "../src/types/movie";

export default async function handler(req: Request, res: Response) {
  try {
    console.log("API /api/movies anropad");
    
    // Använder explicit kolumnlista för att säkerställa att vi får alla fält
    const rows = await executeQuery(`
      SELECT 
        id, title, release_date, box_office, duration, 
        overview, cover_url, trailer_url, directed_by, 
        phase, saga, chronology, post_credit_scenes, 
        imdb_id, updated_at, 
        imdb_rating, rt_rating, mc_rating
      FROM movies
    `);
    
    console.log(`Hittade ${rows.length} filmer i databasen`);
    
    // Loggar första filmen för att kontrollera om betygen finns med
    if (rows.length > 0) {
      const firstMovie = rows[0];
      console.log("Första filmen från databasen:", {
        id: firstMovie.id,
        title: firstMovie.title,
        imdb_rating: firstMovie.imdb_rating,
        rt_rating: firstMovie.rt_rating,
        mc_rating: firstMovie.mc_rating
      });
    }
    
    // Returnerar data i rätt format
    res.status(200).json({
      data: rows as Movie[],
      total: rows.length,
    });
  } catch (err: any) {
    console.error("Fel vid hämtning av filmer:", err);
    res.status(500).json({
      error: {
        code: "500",
        message: "Ett serverfel har inträffat",
        details: process.env.NODE_ENV !== 'production' ? err.message : undefined
      },
    });
  }
}