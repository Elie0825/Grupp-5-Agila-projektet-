import express from "express";           // Express för att skapa en lokal server
import cors from "cors";                 // CORS tillåter anrop från ditt React/Vite-frontend
import { RowDataPacket } from "mysql2/promise"; // Typning för databasresultat
import { getClient } from "./db";        // Hämtar en anslutning till databasen

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Tillåt alla origin 

app.get("/api/movies", async (req, res) => {
  try {
    // Anslut till databasen
    const client = await getClient();

    // Kör SQL-frågan
    const [rows] = await client.query(
      "SELECT * FROM movies"
    ) as [RowDataPacket[], any];

    // Skicka svar till frontend
    res.json({
      data: rows,
      total: rows.length,
    });

    // Släpp anslutningen
    client.release();
  } catch (err) {
    console.error("Fel vid hämtning:", err);
    res.status(500).json({ message: "Något gick fel på servern" });
  }
});

// Starta servern lokalt
app.listen(PORT, () => {
  console.log(`Servern är igång på http://localhost:${PORT}`);
});
