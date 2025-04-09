import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Movie } from '../types/movie';

// OMDb API-nyckel
const OMDB_API_KEY = "8f57b2c1";

// Dummy implementation av calculateAverageRating för att uppfylla interface
const calculateAverageRating = function(this: Movie): number | null {
  const ratings = [
    this.imdb_rating,
    this.rt_rating ? this.rt_rating / 10 : null,
    this.mc_rating ? this.mc_rating / 10 : null
  ].filter((rating): rating is number => rating !== null && rating !== undefined);

  if (ratings.length === 0) return null;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
};

// Interface för MCU API-svar
interface MCUApiResponse {
  data: Movie[];
  total: number;
}

// Interface för OMDb API-svar
interface OMDbResponse {
  Response: string;
  imdbRating?: string;
  Ratings?: {
    Source: string;
    Value: string;
  }[];
  [key: string]: any;
}

export async function fetchAndSaveMoviesToJson(): Promise<void> {
  try {
    // Steg 1: Hämta grunddata från MCU API
    console.log("Hämtar filmer från MCU API...");
    const response = await axios.get<MCUApiResponse>("https://mcuapi.herokuapp.com/api/v1/movies");
    const movies: Movie[] = response.data.data;
    console.log(`Hämtade ${movies.length} filmer från MCU API`);

    // Steg 2: Berika med betyg från OMDb
    const enrichedMovies: Movie[] = [];

    for (const movie of movies) {
      console.log(`Bearbetar film: ${movie.title}`);

      // Hämta betyg från OMDb API
      let imdb_rating: number | null = null;
      let rt_rating: number | null = null;
      let mc_rating: number | null = null;

      try {
        // Använd filmens titel och år för sökning
        const year = new Date(movie.release_date).getFullYear();
        const query = encodeURIComponent(movie.title);

        console.log(`Söker efter "${movie.title}" (${year}) på OMDb...`);
        const omdbResponse = await axios.get<OMDbResponse>(`https://www.omdbapi.com/?t=${query}&y=${year}&apikey=${OMDB_API_KEY}`);

        if (omdbResponse.data && omdbResponse.data.Response === "True") {
          // Hämta IMDb-betyg
          if (omdbResponse.data.imdbRating && omdbResponse.data.imdbRating !== "N/A") {
            imdb_rating = parseFloat(omdbResponse.data.imdbRating);
          }

          // Hämta övriga betyg från Ratings-arrayen
          if (omdbResponse.data.Ratings && Array.isArray(omdbResponse.data.Ratings)) {
            for (const rating of omdbResponse.data.Ratings) {
              if (rating.Source === "Rotten Tomatoes" && rating.Value) {
                // Konvertera "75%" till 75
                rt_rating = parseInt(rating.Value.replace("%", ""));
              } else if (rating.Source === "Metacritic" && rating.Value) {
                // Konvertera "75/100" till 75
                mc_rating = parseInt(rating.Value.split("/")[0]);
              }
            }
          }

          console.log(`Betyg för "${movie.title}": IMDb: ${imdb_rating}, RT: ${rt_rating}, MC: ${mc_rating}`);
        } else {
          console.log(`Ingen träff på OMDb för "${movie.title}"`);
        }
      } catch (error: any) {
        console.error(`Fel vid hämtning av betyg för "${movie.title}":`, error.message);
      }

      // Vänta lite så vi inte överbelastar API:et (max 1000 req/dag)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Lägg till betyg till filmen
      const enrichedMovie: Movie = {
        ...movie,
        imdb_rating,
        rt_rating,
        mc_rating,
        calculateAverageRating
      };

      enrichedMovies.push(enrichedMovie);
    }

    // Steg 3: Spara berikade filmer till en JSON-fil i public-mappen
    const publicDirPath = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDirPath)) {
      fs.mkdirSync(publicDirPath, { recursive: true });
    }

    const jsonFilePath = path.join(publicDirPath, 'marvelmovies.json');
    
    // Skapa en version av objektet som kan serialiseras till JSON
    const serializableMovies = enrichedMovies.map(movie => {
      const { calculateAverageRating, ...movieWithoutFunction } = movie;
      return movieWithoutFunction;
    });

    fs.writeFileSync(
      jsonFilePath, 
      JSON.stringify(serializableMovies, null, 2)
    );

    console.log(`Sparade ${enrichedMovies.length} filmer till: ${jsonFilePath}`);
  } catch (error) {
    console.error("Fel vid hämtning eller sparning av filmer:", error);
  }
}

// Kör alltid när filen körs direkt eller från tsx/Node ESM
fetchAndSaveMoviesToJson().then(() => {
  console.log("Script avslutat.");
  process.exit(0);
}).catch((error) => {
  console.error("Fel vid körning av skriptet:", error);
  process.exit(1);
});