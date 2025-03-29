import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { pool } from "../../backend/db"; // justera sökvägen om den skiljer sig

/**
 * API-route som körs på servern (serverless på Vercel).
 * Hämtar alla filmer från databasen och returnerar som JSON-objekt.
 */
export default async function handler(req: Request, res: Response) {
  try {
    // Hämta filmer från databasen
    const [rows] = await pool.execute("SELECT * FROM movies") as [RowDataPacket[], any];

    // Skicka resultatet i rätt format (som frontend förväntar sig)
    return res.status(200).json({
      data: rows,             // Array med filmer
      total: rows.length      // Antal filmer
    });

  } catch (error) {
    console.error("Fel vid hämtning av filmer från databasen:", error);

    // Skicka felmeddelande till frontend
    return res.status(500).json({
      message: "Något gick fel på servern",
    });
  }
}
