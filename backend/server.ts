import express from "express";
import cors from "cors";
import { executeQuery } from "../api/db";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/movies", async (req, res) => {
  try {
    // Anslut till databasen och hämta filmer
    console.log("Hämtar filmer från databasen...");
    const rows = await executeQuery("SELECT * FROM movies");
    
    console.log(`Hittade ${rows.length} filmer i databasen`);
    
    // Skicka svar till frontend
    res.json({
      data: rows,
      total: rows.length,
    });
  } catch (err: any) { // Märk 'any' här för att lösa typproblemet
    console.error("Fel vid hämtning:", err);
    res.status(500).json({
      error: {
        message: "Något gick fel på servern",
        details: process.env.NODE_ENV !== 'production' ? err.message : undefined
      }
    });
  }
});

// Starta servern lokalt
app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});