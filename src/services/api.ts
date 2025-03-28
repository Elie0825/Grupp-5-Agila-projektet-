// api.ts
import axios from "axios";
import { Movie } from "../types/movie";

/**
 * Fetches Marvel movies from deployed backend API route on Vercel.
 * @returns An array of Movie objects, or an empty array if the request fails.
 */
export const fetchMarvelMovies = async (): Promise<Movie[]> => {
  try {
    console.log("Calling MCU API via proxy...");

    // Hämta filmer från backend-API:t som i sin tur pratar med Neon/Postgres
    const response = await axios.get("/api/movies");

    // Kontrollera om svaret innehåller data i rätt format
    if (response.data && Array.isArray(response.data)) {
      console.log("Movies successfully fetched:", response.data.length);
      return response.data;
    } else {
      // Felhantering om datan inte är en array
      console.error("Unexpected API response format:", response.data);
      return [];
    }

  } catch (error) {
    // Fångar nätverksfel, CORS-fel, serverfel, m.m.
    console.error("API error:", error);
    return [];
  }
};
