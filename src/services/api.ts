import axios from 'axios';

// Definiera isLocalhost
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const fetchMarvelMovies = async () => {
  try {
    if (isLocalhost) {
      // Lokalt: hämta direkt från MCU API
      const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
      console.log("🎬 Hämtar filmer direkt från MCU API");
      
      // För lokal utveckling - om vi vill ha dummybetyg
      const moviesWithDummyRatings = response.data.data.map(movie => ({
        ...movie,
        imdb_rating: Math.floor(Math.random() * 20 + 65) / 10, // 6.5-8.5
        rt_rating: Math.floor(Math.random() * 20) + 75, // 75-95%
        mc_rating: Math.floor(Math.random() * 20) + 70 // 70-90
      }));
      
      return moviesWithDummyRatings;
    } else {
      // På Vercel: hämta från backend som hämtar från databasen
      try {
        console.log("🎬 Försöker hämta filmer från vår databas...");
        const response = await axios.get("/api/movies");
        console.log(`🎬 Hämtade ${response.data.data.length} filmer från backend/databas`);
        return response.data.data;
      } catch (err) {
        // Om databasen inte svarar, fallback till MCU API
        console.warn("⚠️ Databasfel, använder fallback till MCU API", err.message);
        const fallbackResponse = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
        return fallbackResponse.data.data;
      }
    }
  } catch (error) {
    console.error("❌ Alla försök att hämta filmer misslyckades:", error);
    throw error;
  }
};