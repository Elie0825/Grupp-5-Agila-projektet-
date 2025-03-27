// src/types/movie.ts - Förenklad för första deployment

// API-svar root objekt
export interface Root { /** Vanligt att kalla den översta nivån i en 
  API-respons för Root, eftersom den omsluter alla data. */
  data: Movie[];
  total: number;
}

// Grundläggande filmtyp från API
export interface Movie {
  rating: any;
  id: number;
  title: string;
  release_date: string;
  box_office: number;
  duration: number;
  overview?: string;
  cover_url: string;
  trailer_url?: string;
  directed_by: string;
  phase: number;
  saga: string;
  chronology: number;
  post_credit_scenes: number;
  imdb_id: string;
  updated_at: string;
}

// Grundläggande props-interface

// MovieCard props
export interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

// MovieDetails props
export interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

// SearchFilter props
export interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPhase: number | null;
  onPhaseChange: (phase: number | null) => void;
  phases: number[];
}


export interface MovieCardProps {
  movie: Movie; /** movie är en prop som innehåller en film som skickas från App.tsx
                  * Movie är ett TS-if som definierar hur en film ser ut. */
  onClick: (movie: Movie) => void; 
}

export interface MovieDetailsProps {
  movie: Movie; // filmobjekt från app.tsx som är av typen Movie (interface)
  onClose: () => void; /**onClose={handleCloseDetails}
   → Skickar funktionen handleCloseDetails som prop till MovieDetails.tsx. */
}

export interface SearchFilterProps {
  searchTerm: string; // En string som innehåller nuvarande sökterm
  onSearchChange: (value: string) => void; // En callback-funktion som tar en string och uppdaterar söktermen.
  selectedPhase: number | null; // Antingen ett (fas)number eller null om ingen fas är vald.
  onPhaseChange: (phase: number | null) => void; //  En callback-funktion som tar ett number | null och uppdaterar den valda fasen.
  phases: number[]; // En array av number, innehåller tillgängliga faser att filtrera på
}