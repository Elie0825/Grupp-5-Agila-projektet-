import express from "express"; // importerar express ramverk för att skapa API-servern
import cors from "cors"; // importerar CORS för att tilåta att frontend får anropa från servern
import { getConnection } from "./db";
import { RowDataPacket } from 'mysql2/promise';

const app = express(); // skapar själva express appen
const PORT = process.env.PORT || 3001; // porten som servern kör på, lokalt (3001) eller deploy

app.use(cors()); // Tillåter frontend att anropa API:t

// Skapar en GET-endpoint på /api/movies
app.get("/api/movies", async (req, res) => {
  try {
    const connection = await getConnection();
    
    // Använd RowDataPacket för att typa resultatet
    const [rows] = await connection.execute("SELECT * FROM movies") as [RowDataPacket[], any];
    
    console.log(`${rows.length} filmer hämtade från databasen`);
    
    // Formatera svaret som frontend förväntar sig
    res.json({
      data: rows,
      total: rows.length
    });
  } catch (err) {
    console.error("Fel vid hämtning:", err);
    res.status(500).json({ message: "Något gick fel på servern" });
  }
});
  // Startar servern och skriver ut en bekräftelse i terminalen
  app.listen(PORT, () => {
    console.log(`Servern körs på http://localhost:${PORT}`);
  });
