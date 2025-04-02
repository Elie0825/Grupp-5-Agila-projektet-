import React, { useState, useRef, useEffect } from "react";
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
  const [showFilters, setShowFilters] = useState(false); // Håller reda på om filterpanelen är öppen
  const [showSort, setShowSort] = useState(false); // Håller reda på om sorteringspanelen är öppen

  // Skapar refs för att kunna kolla om man klickar utanför filter- eller sorteringspanelerna
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);

  // Effekt som hanterar klick utanför filter eller sortering för att stänga dem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false); // Stänger filter om man klickar utanför
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSort(false); // Stänger sortering om man klickar utanför
      }
    };

    // Lägg till en lyssnare för klick utanför
    document.addEventListener("mousedown", handleClickOutside);

    // Städa upp eventlyssnaren när komponenten tas bort
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApply = () => {
    setShowFilters(false); // Stänger filterpanelen
    setShowSort(false); // Stänger sorteringspanelen
  };

  const handleClearAll = () => {
    onSearchChange(""); // Rensar sökfältet
    onPhaseChange(null); // Rensar val av fas
    onRatingChange(null); // Rensar betyg
  };

  return (
    <div className="compact-filter-container">
      <div className="compact-filter-header">
        {/* Sökfält för att skriva in filmtitel */}
        <input
          type="text"
          placeholder="Sök Marvel filmer..."
          value={searchTerm} // Visar det aktuella sökordet
          onChange={(e) => onSearchChange(e.target.value)} // Uppdaterar sökordet vid ändring
          className="compact-search-input"
        />
        
        {/* Rensa-knapp om det finns ett sökord */}
        {searchTerm && (
          <button 
            type="button" 
            className="clear-button" 
            onClick={() => onSearchChange('')} // Rensar sökfältet
            aria-label="Rensa sökning"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
        
        <div className="compact-filter-buttons">
          {/* Filter-knapp som visar filterpanelen */}
          <button
            className={`compact-filter-button ${showFilters ? "active" : ""}`} // Aktiverar knappen om filter är öppet
            onClick={() => {
              setShowFilters(!showFilters); // Växlar om filterpanelen ska visas eller inte
              setShowSort(false); // Stänger sorteringspanelen om filterpanelen öppnas
            }}
          >
            <i className="filter-icon">⚙️</i>
            <span>Filter</span>
          </button>
          
          {/* Sorterings-knapp som visar sorteringspanelen */}
          <button

            className={`compact-filter-button ${showSort ? "active" : ""}`} // Aktiverar knappen om sortering är öppen

            className={`compact-sort-button ${showSort ? "active" : ""}`}

            onClick={() => {
              setShowSort(!showSort); // Växlar om sorteringspanelen ska visas eller inte
              setShowFilters(false); // Stänger filterpanelen om sorteringspanelen öppnas
            }}
          >
            <i className="sort-icon">⇅</i>
            <span>Sortera</span>
          </button>
        </div>
      </div>

      {/* Om filterpanelen är öppen, visa filteralternativen */}
      {showFilters && (
        <div className="compact-filter-dropdown" ref={filtersRef}>
          <div className="compact-filter-section">
            {/* Filter för att välja betyg */}
            <div className="compact-filter-group">
              <h4>Minimibetyg: {selectedRating || 0}/10</h4>
              <input
                type="range"
                min="0"
                max="10"
                value={selectedRating || 0} // Värdet på det aktuella betyget
                onChange={(e) => onRatingChange(parseInt(e.target.value))} // Uppdaterar betyget när sliden ändras
                className="compact-range-slider"
              />
            </div>

            {/* Filter för att välja fas (t.ex. fas 1, fas 2, etc.) */}
            <div className="compact-filter-group">
              <h4>Fas</h4>
              <select
                value={selectedPhase || ""} // Värdet på den valda fasen
                onChange={(e) => onPhaseChange(e.target.value ? parseInt(e.target.value) : null)} // Uppdaterar fasen vid val
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

            {/* Knapp för att rensa alla filter */}
            <div className="compact-filter-actions">
              <button
                className="compact-clear-button"
                onClick={handleClearAll} // Rensar alla filter
              >
                Rensa alla filter
              </button>
              {/* Knapp för att tillämpa valda filter */}
              <button className="compact-apply-button" onClick={handleApply}>
                Visa resultat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Om sorteringspanelen är öppen, visa sorteringsalternativen */}
      {showSort && (
        <div className="compact-filter-dropdown" ref={sortRef}>
          <div className="compact-filter-section">
            <h4>Sortera efter</h4>
            <div className="compact-radio-group">
              {/* Sortering efter titel */}
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="title"
                  checked={sortBy === "title"} // Markera den som vald om titeln är vald
                  onChange={() => onSortChange("title")} // Uppdaterar sorteringen till titel
                />
                Titel (A-Ö)
              </label>
              {/* Sortering efter betyg */}
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="rating"
                  checked={sortBy === "rating"} // Markera den som vald om betyg är valt
                  onChange={() => onSortChange("rating")} // Uppdaterar sorteringen till betyg
                />
                Betyg (Hög-Låg)
              </label>
              {/* Sortering efter releasedatum */}
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="release"
                  checked={sortBy === "release"} // Markera den som vald om releasedatum är valt
                  onChange={() => onSortChange("release")} // Uppdaterar sorteringen till releasedatum
                />
                Releasedatum (Nyast först)
              </label>
              {/* Sortering efter kronologisk ordning */}
              <label> 
                <input
                  type="radio"
                  name="sort"
                  value="chronology"
                  checked={sortBy === "chronology"} // Markera den som vald om kronologi är valt
                  onChange={() => onSortChange("chronology")} // Uppdaterar sorteringen till kronologisk ordning
                />
                Kronologisk ordning (MCU)
              </label>
            </div>
            {/* Knapp för att tillämpa vald sortering */}
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