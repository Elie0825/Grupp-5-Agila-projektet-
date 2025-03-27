// src/components/SearchFilter.tsx
import React, { useState } from "react";

// Props som komponenten tar emot
interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedPhase: number | null;
  onPhaseChange: (phase: number | null) => void;
  phases: number[];
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}


const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedPhase,
  onPhaseChange,
  phases,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortChange,
}) => {
    // State för att visa/dölja filter och sortering
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
// Stänger dropdown-menyn efter val
  const handleApply = () => {
    setShowFilters(false);
    setShowSort(false);
  };
 // Rensar alla filter
  const handleClearAll = () => {
    onSearchChange("");
    onPhaseChange(null);
    onRatingChange(null);
  };

  return (
    <div className="compact-filter-container">
      {/* Sökfält och knappar */}
      <div className="compact-filter-header">
        <input
          type="text"
          placeholder="Sök Marvel filmer..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="compact-search-input"
        />
        
        <div className="compact-filter-buttons">
          {/* Filterknapp */}
          <button
            className={`compact-filter-button ${showFilters ? "active" : ""}`}
            onClick={() => {
              setShowFilters(!showFilters);
              setShowSort(false);
            }}
          >
            <i className="filter-icon">⚙️</i>
            <span>Filter</span>
          </button>
          {/* Sorteringsknapp */}
          <button
            className={`compact-filter-button ${showSort ? "active" : ""}`}
            onClick={() => {
              setShowSort(!showSort);
              setShowFilters(false);
            }}
          >
            <i className="sort-icon">⇅</i>
            <span>Sortera</span>
          </button>
        </div>
      </div>

      {/* Filter-dropdown */}
      {showFilters && (
        <div className="compact-filter-dropdown">
          <div className="compact-filter-section">
            {/* Betygsfilter */}
            <div className="compact-filter-group">
              <h4>Minimibetyg: {selectedRating || 0}/10</h4>
              <input
                type="range"
                min="0"
                max="10"
                value={selectedRating || 0}
                onChange={(e) => onRatingChange(parseInt(e.target.value))}
                className="compact-range-slider"
              />
            </div>

            {/* Fas-filter */}
            <div className="compact-filter-group">
              <h4>Fas</h4>
              <select
                value={selectedPhase || ""}
                onChange={(e) => onPhaseChange(e.target.value ? parseInt(e.target.value) : null)}
                className="compact-select"
              >
                <option value="">Alla faser</option>
                {phases.map((phase) => (
                  <option key={phase} value={phase}>
                    Fas {phase}
                  </option>
                ))}
              </select>
            </div>
            {/* Knappar för att rensa och tillämpa */}
            <div className="compact-filter-actions">
              <button
                className="compact-clear-button"
                onClick={handleClearAll}
              >
                Rensa alla filter
              </button>
              <button className="compact-apply-button" onClick={handleApply}>
                Visa resultat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sorterings-dropdown */}
      {showSort && (
        <div className="compact-filter-dropdown">
          <div className="compact-filter-section">
            <h4>Sortera efter</h4>
            <div className="compact-radio-group">
              {/* Alternativ för sortering */}
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="title"
                  checked={sortBy === "title"}
                  onChange={() => onSortChange("title")}
                />
                Titel (A-Ö)
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="rating"
                  checked={sortBy === "rating"}
                  onChange={() => onSortChange("rating")}
                />
                Betyg (Hög-Låg)
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="release"
                  checked={sortBy === "release"}
                  onChange={() => onSortChange("release")}
                />
                Releasedatum (Nyast först)
              </label>
            </div>
            <button className="compact-apply-button" onClick={handleApply}>
              Tillämpa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;