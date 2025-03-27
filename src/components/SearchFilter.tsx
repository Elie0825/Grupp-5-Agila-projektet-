import React, { useState } from "react";
import { SearchFilterProps } from '../types/movie';

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchTerm, 
  onSearchChange, 
  selectedPhase, 
  onPhaseChange,
  phases,
  selectedRating = null,
  onRatingChange = () => {},
  sortBy = 'title',
  onSortChange = () => {}
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const handleApply = () => {
    setShowFilters(false);
    setShowSort(false);
  };

  const handleClearAll = () => {
    onSearchChange("");
    onPhaseChange(null);
    onRatingChange(null);
  };

  return (
    <div className="compact-filter-container">
      <div className="compact-filter-header">
        <input
          type="text"
          placeholder="Sök Marvel filmer..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="compact-search-input"
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
        
        <div className="compact-filter-buttons">
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

      {showFilters && (
        <div className="compact-filter-dropdown">
          <div className="compact-filter-section">
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

      {showSort && (
        <div className="compact-filter-dropdown">
          <div className="compact-filter-section">
            <h4>Sortera efter</h4>
            <div className="compact-radio-group">
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