import { MarvelCharacters } from '../types/character';

/**
 * Hämtar alla Marvel-karaktärer från den lokala JSON-filen
 * @returns En lista med MarvelCharacters
 */
export const fetchMarvelCharacters = async (): Promise<MarvelCharacters[]> => {
  try {
    // Hämta data från den lokala JSON-filen istället för API
    const response = await fetch('/marvelcharacters.json');
    
    if (!response.ok) {
      throw new Error(`Kunde inte hämta karaktärer: ${response.status} ${response.statusText}`);
    }
    
    const characters: MarvelCharacters[] = await response.json();
    return characters;
  } catch (error) {
    console.error('Fel vid hämtning av Marvel-karaktärer:', error);
    throw error; // Kasta felet vidare för att hantera det i komponenten
  }
};

/**
 * Hämtar en specifik Marvel-karaktär baserat på ID
 * @param id Karaktärens ID
 * @returns Den matchande karaktären eller null om ingen hittades
 */
export const fetchMarvelCharacterById = async (id: number): Promise<MarvelCharacters | null> => {
  try {
    const allCharacters = await fetchMarvelCharacters();
    const character = allCharacters.find(char => char.id === id);
    
    if (!character) {
      console.warn(`Ingen karaktär hittades med ID: ${id}`);
      return null;
    }
    
    return character;
  } catch (error) {
    console.error(`Fel vid hämtning av karaktär med ID ${id}:`, error);
    throw error;
  }
};

/**
 * Söker efter Marvel-karaktärer baserat på en sökterm
 * @param query Söktermen att filtrera på
 * @returns En filtrerad lista med karaktärer som matchar söktermen
 */
export const searchMarvelCharacters = async (query: string): Promise<MarvelCharacters[]> => {
  if (!query || query.trim() === '') {
    return fetchMarvelCharacters();
  }
  
  try {
    const allCharacters = await fetchMarvelCharacters();
    const normalizedQuery = query.toLowerCase().trim();
    
    return allCharacters.filter(character => 
      character.name.toLowerCase().includes(normalizedQuery) ||
      (character.real_name && character.real_name.toLowerCase().includes(normalizedQuery))
    );
  } catch (error) {
    console.error('Fel vid sökning efter karaktärer:', error);
    throw error;
  }
};