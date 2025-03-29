
import { Request, Response } from "express"; // Importerar typer för Express-request/response
import { RowDataPacket } from "mysql2"; // Typning av svar från MySQL
import { pool } from "./db"; // Importerar vår databasanslutning (från flyttad db.ts-fil)
import { Movie } from "../src/types/movie"; // Importerar vår Movie-typ så vi kan type-casta resultatet från databasen
/**
 * GET-endpoint som anropas från frontend (serverless via Vercel)
 * Hämtar alla filmer från databasen och returnerar som JSON
 */
export default async function handler(req: Request, res: Response) {
  try {
    // 🔹 Hämta alla filmer från databasen
    const [rows] = await pool.execute(
      "SELECT * FROM movies"
    ) as RowDataPacket[][];

    // 🔹 Skicka tillbaka filmerna till frontend i rätt format
    res.status(200).json({
      data: rows as Movie[],         // Array med filmer
      total: (rows as Movie[]).length, // Totalt antal filmer
    });
  } catch (error) {
    // Något gick fel – logga felet och skicka tillbaka ett felmeddelande
    console.error("Fel vid hämtning av filmer:", error);
    res.status(500).json({
      error: {
        code: "500",
        message: "A server error has occurred",
      },
    });
  }
}