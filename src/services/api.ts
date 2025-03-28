import axios from "axios";
import { Movie } from "../types/movie";

/**
 * Fetches Marvel movies from deployed backend API route on Vercel.
 * @returns An array of Movie objects, or an empty array if the request fails.
 */
const isLocalhost = window.location.hostname === 'localhost';

export const fetchMarvelMovies = async () => {
  if (isLocalhost) {
    // Lokalt: hämta direkt från MCU API
    const response = await axios.get("https://mcuapi.herokuapp.com/api/v1/movies");
    console.log("🎬 Hämta filmer direkt från MCU API");
    return response.data.data;
  } else {
    // På Vercel: hämta från backend som hämtar från databasen
    const response = await axios.get("/api/movies");
    console.log("🎬 Hämta filmer från backend/databas");
    return response.data.data;
  }
};

