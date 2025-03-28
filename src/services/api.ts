// src/services/api.ts
import { Movie, Root } from '../types/movie';

/**
 * Hämtar alla Marvel-filmer via proxy
 * returns En array med Marvel-filmer
 */
// src/services/api.ts

export async function fetchMarvelMovies() {
  try {
    const response = await fetch("https://mcuapi.herokuapp.com/api/v1/movies");


    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Externa API:t lägger filmerna under "data"
  } catch (error) {
    console.error("Failed to fetch Marvel movies:", error);
    return []; // Returnera tom array så sidan inte kraschar
  }
};
