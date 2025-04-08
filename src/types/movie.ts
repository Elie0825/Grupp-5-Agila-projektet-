// API-svar root objekt
export interface Root {
  data: Movie[];
  total: number;
}

// Grundläggande filmtyp från API
export interface Movie {
  calculateAverageRating(): unknown;
  id: number;
  rating: number | null;
  title: string;
  release_date: string;
  duration: number;
  overview?: string;
  cover_url: string;
  trailer_url?: string;
  phase: number;
  saga: string;
  chronology: number;
  imdb_rating?: number | null;  // IMDb betyg (0-10)
  rt_rating?: number | null;    // Rotten Tomatoes betyg (0-100%)
  mc_rating?: number | null;    // Metacritic betyg (0-100)
}

// Props-interfaces
export interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

export interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
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