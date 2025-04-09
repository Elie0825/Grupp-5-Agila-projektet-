import { Movie } from '../types/movie';

/**
 * Inspekterar Marvel-filmer från JSON-filen för felsökning
 * Använd för att identifiera problem med data och datastrukturer
 */
export const inspectMoviesFile = async () => {
  try {
    console.group('📊 JSON-fil inspektion');
    
    // Hämta JSON-filen direkt
    const response = await fetch('/marvelmovies.json', { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (!response.ok) {
      console.error(`Kunde inte hämta JSON-filen: ${response.status}`);
      console.groupEnd();
      return;
    }
    
    const movies = await response.json();
    console.log(`Totalt antal filmer i JSON-filen: ${movies.length}`);
    
    // Kontrollera problem med första filmen
    if (movies.length > 0) {
      const firstMovie = movies[0];
      console.log('Första filmen:');
      console.log(`- ID: ${firstMovie.id}`);
      console.log(`- Titel: ${firstMovie.title}`);
      console.log(`- Release date: ${firstMovie.release_date} (${typeof firstMovie.release_date})`);
      console.log(`- Duration: ${firstMovie.duration} (${typeof firstMovie.duration})`);
      console.log(`- Chronology: ${firstMovie.chronology} (${typeof firstMovie.chronology})`);
      console.log(`- Phase: ${firstMovie.phase} (${typeof firstMovie.phase})`);
    }
    
    // Genomsök alla filmer efter saknade fält
    let moviesWithMissingFields = 0;
    const missingFields = { 
      release_date: 0, 
      duration: 0, 
      chronology: 0, 
      phase: 0 
    };
    
    for (const movie of movies) {
      let hasMissingFields = false;
      
      if (movie.release_date === undefined) {
        missingFields.release_date++;
        hasMissingFields = true;
      }
      
      if (movie.duration === undefined) {
        missingFields.duration++;
        hasMissingFields = true;
      }
      
      if (movie.chronology === undefined) {
        missingFields.chronology++;
        hasMissingFields = true;
      }
      
      if (movie.phase === undefined) {
        missingFields.phase++;
        hasMissingFields = true;
      }
      
      if (hasMissingFields) {
        moviesWithMissingFields++;
        console.log(`Film med saknade fält: ${movie.title} (ID: ${movie.id})`);
      }
    }
    
    console.log(`Filmer med saknade fält: ${moviesWithMissingFields} av ${movies.length}`);
    console.log('Antal filmer som saknar specifika fält:');
    console.log(`- release_date: ${missingFields.release_date}`);
    console.log(`- duration: ${missingFields.duration}`);
    console.log(`- chronology: ${missingFields.chronology}`);
    console.log(`- phase: ${missingFields.phase}`);
    
    console.groupEnd();
  } catch (error) {
    console.error('Fel vid inspektion av JSON-fil:', error);
    console.groupEnd();
  }
};

/**
 * Analyserar filmdata för att hitta problem med betyg
 * @param movies Array av filmobjekt
 */
export const analyzeMovieRatings = (movies: Movie[]) => {
  console.group('⭐ Betygsanalys');
  
  let moviesWithoutRatings = 0;
  let ratingsDistribution = {
    imdb: 0,
    rt: 0,
    mc: 0
  };
  
  for (const movie of movies) {
    const hasImdb = movie.imdb_rating !== undefined && movie.imdb_rating !== null;
    const hasRt = movie.rt_rating !== undefined && movie.rt_rating !== null;
    const hasMc = movie.mc_rating !== undefined && movie.mc_rating !== null;
    
    if (hasImdb) ratingsDistribution.imdb++;
    if (hasRt) ratingsDistribution.rt++;
    if (hasMc) ratingsDistribution.mc++;
    
    if (!hasImdb && !hasRt && !hasMc) {
      moviesWithoutRatings++;
      console.log(`Film utan betyg: ${movie.title} (ID: ${movie.id})`);
    }
  }
  
  console.log(`Filmer utan några betyg: ${moviesWithoutRatings} av ${movies.length}`);
  console.log('Betygsfördelning:');
  console.log(`- IMDb: ${ratingsDistribution.imdb} filmer (${Math.round(ratingsDistribution.imdb / movies.length * 100)}%)`);
  console.log(`- Rotten Tomatoes: ${ratingsDistribution.rt} filmer (${Math.round(ratingsDistribution.rt / movies.length * 100)}%)`);
  console.log(`- Metacritic: ${ratingsDistribution.mc} filmer (${Math.round(ratingsDistribution.mc / movies.length * 100)}%)`);
  
  console.groupEnd();
};

/**
 * Jämför filmdata från olika källor för att identifiera diskrepanser
 */
export const compareMovieData = async (jsonPath: string = '/marvelmovies.json') => {
  try {
    console.group('🔄 Jämförelse av filmdata');
    
    // Hämta JSON-filen direkt
    const jsonResponse = await fetch(jsonPath, { cache: 'no-store' });
    
    if (!jsonResponse.ok) {
      console.error(`Kunde inte hämta JSON-filen: ${jsonResponse.status}`);
      console.groupEnd();
      return;
    }
    
    const jsonMovies = await jsonResponse.json();
    
    // Fördröjd hämtning för att simulera API-anrop
    setTimeout(async () => {
      // Använd API-servicen för att hämta filmer
      try {
        const apiMovies = await fetchMarvelMovies();
        
        console.log(`JSON-fil: ${jsonMovies.length} filmer`);
        console.log(`API-service: ${apiMovies.length} filmer`);
        
        if (jsonMovies.length !== apiMovies.length) {
          console.warn(`⚠️ Diskrepans: ${jsonMovies.length - apiMovies.length} filmer saknas i API-svaret`);
          
          // Hitta vilka filmer som saknas
          const apiMovieIds = new Set(apiMovies.map(m => m.id));
          const missingMovies = jsonMovies.filter((jm: any) => !apiMovieIds.has(jm.id));
          
          console.log('Filmer som saknas i API-svaret:');
          missingMovies.forEach((movie: any) => {
            console.log(`- ${movie.title} (ID: ${movie.id})`);
          });
        } else {
          console.log('✅ Antalet filmer matchar mellan JSON-filen och API-svaret');
        }
      } catch (error) {
        console.error('Fel vid hämtning via API:', error);
      }
    }, 1000);
    
    console.groupEnd();
  } catch (error) {
    console.error('Fel vid jämförelse av filmdata:', error);
    console.groupEnd();
  }
};

// För att tillfredsställa TypeScript
import { fetchMarvelMovies } from './api';

// För bakåtkompatibilitet (ändra analyzeMoviesData till inspectMoviesFile)
export const analyzeMoviesData = inspectMoviesFile;