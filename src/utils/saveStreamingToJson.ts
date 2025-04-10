// import fs from 'fs';
// import path from 'path';
// import axios from 'axios';
// import { Movie } from '../types/movie';

// ///////////////////////////////
// Detta var apiet som höll vart filmersna går att streama, men det blev problem med nyckeln, och han inte lösa det,
// så testade med att göra funktionen manuell. Stötte på ett problem och hann inte fixa det heller.
// Har gjort flera versioner.
// /////////////////////////////

// const RAPID_API_KEY = 'd714cca026mshb1ddcecef9e704ap11cfebjsn01a59249d00a';

// interface StreamingApiResponse {
//   result: {
//     [platform: string]: {
//       link: string;
//     };
//   };
// }

// interface StreamingInfo {
//   [platform: string]: string;
// }

// /*params: {
//     imdb_id: imdbId,
//     country: 'se'
//   }*/

    // Gör ett HTTP-anrop via axios för att hämta streaminginformation baserat på IMDb-ID
//   const fetchStreamingAvailability = async (imdbId: string): Promise<StreamingInfo | null> => {
//     try {
//       const response = await axios.get<StreamingApiResponse>('https://streaming-availability.p.rapidapi.com/shows/movie/' + imdbId, {
//         headers: {
//           'X-RapidAPI-Key': 'd714cca026mshb1ddcecef9e704ap11cfebjsn01a59249d00a',
//           'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
//         }
      
//       });
         
         // Skapar ett objekt för att lagra plattformar med länkar
//       const platforms: StreamingInfo = {};
//       const platformsToCheck = ['Disney+', 'HBO Max', 'Prime Video', 'Apple TV'];
  
        // Går igenom varje plattform och kontrollerar om det finns en länk
//       platformsToCheck.forEach(platform => {
//         const platformData = response.data.result[platform];
//         if (platformData && platformData.link) {
//           platforms[platform] = platformData.link;
//         }
//       });
  
        // Om vi hittar några plattformar, returnera objektet med länkar
//       return Object.keys(platforms).length > 0 ? platforms : null;
//     } catch (error) {
//       console.error(`Streaming info fetch error for IMDB ID ${imdbId}:`, error);
//       return null;
//     }
//   };
  

//   ////////////

// async function saveStreamingInfoToJson(movies: Movie[]): Promise<void> {
//     const streamingInfoMap: Record<string, StreamingInfo> = {};
//     const moviesToProcess = movies.slice(0, 5); // Process only a few movies at a time
  
//     for (const movie of moviesToProcess) {
//       const imdbId = (movie as any).imdb_id;
      
//       if (imdbId) {
//         console.log(`Fetching streaming info for ${movie.title}`);
//         const streamingInfo = await fetchStreamingAvailability(imdbId);
        
//         if (streamingInfo) {
//           streamingInfoMap[imdbId] = streamingInfo;
//         }
  
//         // Wait for a short period before the next request
//         await new Promise(resolve => setTimeout(resolve, 3000)); // 2 second delay
//       }
//     }
  
//     const publicDirPath = path.resolve(process.cwd(), 'public');
//     if (!fs.existsSync(publicDirPath)) {
//       fs.mkdirSync(publicDirPath, { recursive: true });
//     }
  
//     const jsonFilePath = path.join(publicDirPath, 'movie-streaming.json');
    
//     fs.writeFileSync(
//       jsonFilePath, 
//       JSON.stringify(streamingInfoMap, null, 2)
//     );
  
//     console.log(`Streaming info saved to: ${jsonFilePath}`);
//   }

// async function fetchMovies(): Promise<Movie[]> {
//     try {
//       const filePath = path.resolve(new URL('.', import.meta.url).pathname, '../../public/marvelmovies.json');
//       const data = fs.readFileSync(filePath, 'utf-8');
//       const movies: Movie[] = JSON.parse(data);
//       return movies;
//     } catch (error) {
//       console.error("Fel vid hämtning av filmer:", error);
//       return [];
//     }
//   }

// async function main() {
//   try {
//     console.log("Hämtar filmer...");
//     const movies = await fetchMovies();
//     console.log(`Hämtade ${movies.length} filmer.`);

//     console.log("Sparar streaming-info...");
//     await saveStreamingInfoToJson(movies);
//     console.log("Streaming-info sparad.");
//   } catch (error) {
//     console.error("Fel vid hämtning eller sparning av streaming-info:", error);
//   }
// }

// main().then(() => {
//   console.log("Skript avslutat.");
//   process.exit(0);
// }).catch((error) => {
//   console.error("Fel vid körning av skriptet:", error);
//   process.exit(1);
// });

// export type { StreamingInfo };