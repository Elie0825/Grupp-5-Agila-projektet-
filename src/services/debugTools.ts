import { Movie } from '../types/movie';

export const analyzeMoviesData = (movies: any[]): void => {
  console.group('=== MOVIEANALYS ===');
  console.log(`Totalt antal objekt: ${movies.length}`);
  
  // Kontrollera typer för varje fält i den första filmen
  if (movies.length > 0) {
    const firstMovie = movies[0];
    console.log('Struktur för första filmen:');
    Object.keys(firstMovie).forEach(key => {
      console.log(`- ${key}: ${typeof firstMovie[key]} (${firstMovie[key] === null ? 'null' : 'har värde'})`);
    });
  }
  
  // Kontrollera vilka fält som saknas i filmerna
  let missingFieldCounts: Record<string, number> = {};
  let invalidTypeCounts: Record<string, number> = {};
  
  // Definiera förväntade fält och deras typer
  const expectedFields: Record<string, string> = {
    id: 'number',
    title: 'string',
    release_date: 'string',
    phase: 'number',
    duration: 'number',
    cover_url: 'string',
    trailer_url: 'string',
    overview: 'string',
    imdb_rating: 'number',
    rt_rating: 'number',
    mc_rating: 'number'
  };
  
  // Kontrollera varje film
  movies.forEach((movie, index) => {
    Object.keys(expectedFields).forEach(field => {
      // Kontrollera om fältet finns
      if (movie[field] === undefined) {
        missingFieldCounts[field] = (missingFieldCounts[field] || 0) + 1;
      } 
      // Om fältet finns, kontrollera om det är rätt typ
      else if (movie[field] !== null && typeof movie[field] !== expectedFields[field]) {
        invalidTypeCounts[field] = (invalidTypeCounts[field] || 0) + 1;
        console.warn(`Film ${index} (${movie.title || 'okänd titel'}) har fel datatyp för ${field}: ${typeof movie[field]}`);
      }
    });
  });
  
  // Visa resultat
  console.log('Fält som saknas:');
  Object.keys(missingFieldCounts).forEach(field => {
    console.log(`- ${field}: saknas i ${missingFieldCounts[field]} filmer`);
  });
  
  console.log('Fält med fel datatyp:');
  Object.keys(invalidTypeCounts).forEach(field => {
    console.log(`- ${field}: fel typ i ${invalidTypeCounts[field]} filmer`);
  });
  
  // Hitta filmer med mest problem
  const problemMovies = movies.map((movie, index) => {
    let problems = 0;
    Object.keys(expectedFields).forEach(field => {
      if (movie[field] === undefined) problems++;
      else if (movie[field] !== null && typeof movie[field] !== expectedFields[field]) problems++;
    });
    return { index, title: movie.title || 'Okänd', problems };
  }).filter(m => m.problems > 0)
    .sort((a, b) => b.problems - a.problems)
    .slice(0, 5);
  
  if (problemMovies.length > 0) {
    console.log('Filmer med mest problem:');
    problemMovies.forEach(m => {
      console.log(`- ${m.title} (index ${m.index}): ${m.problems} problem`);
    });
  }
  
  console.groupEnd();
};

// Användning:
// Importera denna funktion och anropa den när du har laddat filmerna
// import { analyzeMoviesData } from '../services/debugTools';
// analyzeMoviesData(fetchedMovies);