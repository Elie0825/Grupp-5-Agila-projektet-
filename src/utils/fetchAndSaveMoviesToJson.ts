import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Movie } from '../types/movie';

// OMDb API-nyckel
const OMDB_API_KEY = "8f57b2c1";

// Skyddade fält som inte ska uppdateras eller måste bevaras
const PROTECTED_FIELDS: Array<keyof Movie> = [
  'overview', 'cover_url', 'trailer_url', 
  'release_date', 'duration', 'chronology', 'phase',
  'saga', 'post_credit_scenes', 'directed_by', 'title'
];

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
    // Första: Läs in befintliga filmer från JSON-filen om den finns
    const jsonFilePath = path.join(process.cwd(), 'public', 'marvelmovies.json');
    let existingMovies: Movie[] = [];
    
    if (fs.existsSync(jsonFilePath)) {
      try {
        console.log("Läser in befintliga filmer från JSON-filen...");
        const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
        existingMovies = JSON.parse(fileContent);
        console.log(`Läste in ${existingMovies.length} befintliga filmer.`);
      } catch (error) {
        console.warn("Kunde inte läsa in befintlig JSON-fil:", error);
      }
    }
    
    // Skapa en map för att enkelt hitta befintliga filmer via ID
    const existingMoviesMap = new Map(
      existingMovies.map(movie => [movie.id, movie])
    );
    
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
        const releaseDate = movie.release_date || (existingMoviesMap.get(movie.id)?.release_date || '');
        const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
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
      
      // Hitta befintlig film
      const existingMovie = existingMoviesMap.get(movie.id);
      
      // Skapa ett nytt objekt med nya data och bevara viktiga fält
      const enrichedMovie: Movie = {
        ...movie,
        // Säkerställ att viktiga fält finns (använd befintliga värden eller standardvärden)
        release_date: movie.release_date || (existingMovie?.release_date || '2000-01-01'),
        duration: typeof movie.duration === 'number' ? movie.duration : (existingMovie?.duration || 120),
        chronology: typeof movie.chronology === 'number' ? movie.chronology : (existingMovie?.chronology || 1),
        phase: typeof movie.phase === 'number' ? movie.phase : (existingMovie?.phase || 1),
        saga: movie.saga || (existingMovie?.saga || 'Unknown Saga'),
        cover_url: movie.cover_url || (existingMovie?.cover_url || ''),
        trailer_url: movie.trailer_url || (existingMovie?.trailer_url || ''),
        overview: movie.overview || (existingMovie?.overview || ''),
        
        // Lägg till nya betyg men behåll befintliga om nya är null
        imdb_rating: imdb_rating !== null ? imdb_rating : (existingMovie?.imdb_rating ?? null),
        rt_rating: rt_rating !== null ? rt_rating : (existingMovie?.rt_rating ?? null),
        mc_rating: mc_rating !== null ? mc_rating : (existingMovie?.mc_rating ?? null),
        calculateAverageRating
      };
      
      // Bevara ytterligare skyddade fält från den befintliga filmen om den finns
      if (existingMovie) {
        // Loopa genom skyddade fält och kopiera dem explicit
        for (const field of PROTECTED_FIELDS) {
          if (existingMovie[field] !== undefined && (movie[field] === undefined || movie[field] === null)) {
            (enrichedMovie as any)[field] = existingMovie[field];
          }
        }
      }
      
      enrichedMovies.push(enrichedMovie);
    }
    
    // Steg 3: Spara berikade filmer till en JSON-fil i public-mappen
    const publicDirPath = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDirPath)) {
      fs.mkdirSync(publicDirPath, { recursive: true });
    }
    
    // Skapa en version av objektet som kan serialiseras till JSON
    const serializableMovies = enrichedMovies.map(movie => {
      // Kontrollera och logga saknade viktiga fält
      const missingFields = ['release_date', 'duration', 'chronology', 'phase'].filter(
        field => movie[field as keyof Movie] === undefined
      );
      
      if (missingFields.length > 0) {
        console.warn(`Varning: Film "${movie.title}" saknar fortfarande fält: ${missingFields.join(', ')}`);
      }
      
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