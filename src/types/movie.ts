// src/types/movie.ts - Förenklad för första deployment

// API-svar root objekt
export interface Root {
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