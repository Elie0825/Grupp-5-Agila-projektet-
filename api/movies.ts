import { Request, Response } from "express";
import { executeQuery } from "./db";
import { Movie } from "../src/types/movie";

export default async function handler(req: Request, res: Response) {
  try {
    console.log("API /api/movies anropad");
    
    // Använd vår executeQuery-funktion för att hämta filmer
    const rows = await executeQuery("SELECT * FROM movies");
    
    console.log(`Hittade ${rows.length} filmer i databasen`);
    
    // Returnera data i rätt format
    res.status(200).json({
      data: rows as Movie[],
      total: rows.length,
    });
  } catch (err: any) { // 'any' för att lösa typproblemet
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