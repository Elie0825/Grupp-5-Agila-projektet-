// src/components/SearchFilter.tsx
import React from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPhase: number | null;
  onPhaseChange: (phase: number | null) => void;
  phases: number[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedPhase, 
  onPhaseChange,
  phases 
}) => {
  
  return (
    <nav className="search-filters" aria-label="Filtrera filmer">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="visually-hidden">Sök och filtrering</legend>
          
          <section className="search-section">
            <label htmlFor="movie-search">Sök:</label>
            <div className="search-wrapper">
              <input
                type="search"
                id="movie-search"
                placeholder="Sök efter filmer..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Sök efter filmer"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={() => onSearchChange('')}
                  aria-label="Rensa sökning"
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
          </section>

          <section className="filter-section">
            <label htmlFor="phase-filter">Filtrera efter fas:</label>
            <select 
              id="phase-filter"
              value={selectedPhase || ""} 
              onChange={(e) => onPhaseChange(e.target.value ? Number(e.target.value) : null)}
              aria-label="Filtrera efter fas"
            >
              <option value="">Alla faser</option>
              {phases.map(phase => (
                <option key={phase} value={phase}>Fas {phase}</option>
              ))}
            </select>
          </section>
        </fieldset>
      </form>
    </nav>
  );
};

export default SearchFilter;