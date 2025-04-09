// API-svar root objekt
export interface Root {
  data: Movie[];
  total: number;
}

// Grundläggande filmtyp från API
export interface Movie {
  id: number;
  title: string;
  release_date: string;
  duration: number;
  overview?: string | null;
  cover_url: string | null;
  trailer_url?: string | null;
  phase: number;
  saga?: string | null;
  chronology: number;
  post_credit_scenes?: number;
  directed_by?: string[];
  imdb_rating?: number | null;  // IMDb betyg (0-10)
  rt_rating?: number | null;    // Rotten Tomatoes betyg (0-100%)
  mc_rating?: number | null;    // Metacritic betyg (0-100)
  box_office?: string | number | null;
  rating?: number | null;       // Behåll för bakåtkompatibilitet
  
  // Definiera metoden som valfri eftersom den kan saknas i JSON-data
  calculateAverageRating?: () => number | null;
  
  // Tillåt andra egenskaper för flexibilitet
  [key: string]: any;
}

// Props-interfaces
export interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  onCharacterClick?: (character: any) => void;
  movies?: Movie[]; // För att hitta relaterade filmer
}

export interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPhase: number | null;
  onPhaseChange: (phase: number | null) => void;
  phases: number[];
  selectedRating?: number | null;
  onRatingChange?: (rating: number | null) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}