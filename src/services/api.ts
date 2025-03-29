// api.ts - med robust fallback
import axios from "axios";
import { Movie } from "../types/movie";

const isLocalhost = window.location.hostname === 'localhost';

export const fetchMarvelMovies = async () => {
  try {
    // Först försöker vi hämta data från rätt källa baserat på miljö
    if (isLocalhost) {
      // Lokalt: hämta direkt från MCU API
      const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
      console.log("🎬 Hämtade filmer direkt från MCU API (lokal utveckling)");
      return response.data.data;
    } else {
      // På Vercel: försök hämta från vår databas via API
      try {
        console.log("🎬 Försöker hämta filmer från vår databas via API");
        const response = await axios.get("/api/movies", { timeout: 8000 });
        console.log(`🎬 Framgångsrikt hämtade ${response.data.data.length} filmer från vår API/databas`);
        return response.data.data;
      } catch (err) {
        // Om Vercel API/databas misslyckas, fallback till MCU API
        console.warn("⚠️ Kunde inte hämta filmer från vår databas:", err.message);
        console.log("🎬 Försöker fallback till MCU API...");
        
        const fallbackResponse = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
        console.log(`🎬 Framgångsrikt hämtade ${fallbackResponse.data.data.length} filmer från MCU API (fallback)`);
        
        return fallbackResponse.data.data;
      }
    }
  } catch (error) {
    console.error("Alla försök att hämta filmer misslyckades:", error);
    throw error; // Låt komponenten hantera fel om både primär och fallback misslyckas
  }
};