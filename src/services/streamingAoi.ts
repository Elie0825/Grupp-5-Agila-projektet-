// exporterar funktion som hämtar streaminginformation för en film baserat på imdbId
export const fetchMovieStreamingInfo = async (imdbId: string) => {
    try {
      // Skicka en fetch-begäran för att hämta json filen
      const response = await fetch('/movie-streaming.json');

      const streamingData = await response.json();
  
      // Returnera den specifika streaminginformationen för den aktuella filmen baserat på imdbId
      // Om data inte finns för imdbId returneras null
      return streamingData[imdbId] || null;
    } catch (error) {
      console.error('Error fetching streaming info:', error);
  
      return null;
    }
  };
  