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