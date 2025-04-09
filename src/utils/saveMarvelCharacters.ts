import axios from 'axios';
import * as fs from 'fs-extra';
import * as path from 'path';
import { MarvelCharacters } from '../types/character';

const SUPERHERO_API_KEY = '9027e21be002c76e7e0e21003c796431';
const API_BASE_URL = `https://superheroapi.com/api/${SUPERHERO_API_KEY}`;

// Typ för API-svar
type SuperheroApiResponse = {
  id: string;
  name: string;
  biography: {
    publisher: string;
    ['full-name']: string;
    ['first-appearance']: string;
  };
  image: {
    url: string;
  };
};

// Funktion för att vänta
const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Hämta karaktärer i omgångar pga så många
const startId = 600;
const endId = 731;
const characterIds = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);

async function fetchAndSaveMarvelCharacters(): Promise<void> {
  console.log(`Skript startat - Hämtar Marvel-karaktärer från ID ${startId} till ${endId}...`);

  // Läs in existerande fil om den finns
  let existingCharacters: MarvelCharacters[] = [];
  const outputPath = path.resolve('public/marvelcharacters.json');

  try {
    if (await fs.pathExists(outputPath)) {
      existingCharacters = await fs.readJson(outputPath);
      console.log(`Läste in ${existingCharacters.length} befintliga karaktärer från filen.`);
    }
  } catch {
    console.warn('Kunde inte läsa in befintlig fil. Skapar en ny.');
  }

  const marvelCharacters: MarvelCharacters[] = [];

  for (const id of characterIds) {
    try {
      console.log(`Hämtar karaktär med ID: ${id}`);

      const response = await axios.get<SuperheroApiResponse>(`${API_BASE_URL}/${id}`);
      const character = response.data;

      if (character.biography?.publisher === 'Marvel Comics') {
        console.log(`✅ Hittade Marvel-karaktär: ${character.name}`);

        const formatted: MarvelCharacters = {
          id: Number(character.id),
          name: character.name,
          real_name: character.biography['full-name'] || character.name,
          description: character.biography['first-appearance'] || 'Ingen beskrivning tillgänglig',
          image_url: character.image?.url || '',
          movies: [] // Kan fyllas på manuellt senare
        };

        marvelCharacters.push(formatted);
      }

      await wait(300); // undviker att spamma API:et

    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Fel vid ID ${id}: ${error.message}`);
      } else {
        console.error(`❌ Okänt fel vid ID ${id}`);
      }
    }
  }

  // Kombinera och ta bort dubbletter
  const allCharacters = [...existingCharacters, ...marvelCharacters];
  const uniqueCharacters = allCharacters.filter(
    (char, index, self) => index === self.findIndex(c => c.id === char.id)
  );

  if (marvelCharacters.length > 0) {
    try {
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeJson(outputPath, uniqueCharacters, { spaces: 2 });

      console.log(`✅ Sparade totalt ${uniqueCharacters.length} Marvel-karaktärer till: public/marvelcharacters.json`);
      console.log(`✅ Denna körning hittade ${marvelCharacters.length} nya.`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Fel vid sparande:', error.message);
      }
    }
  } else {
    console.log('⚠️ Inga nya karaktärer att spara den här gången.');
  }
}

// Kör funktionen
fetchAndSaveMarvelCharacters().catch(error => {
  console.error('❌ Oväntat fel:', error);
});
