import React, { useState, useRef, useEffect } from "react";
import { SearchFilterProps } from '../types/movie';
import '../css/search-filter.css';

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
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Skapar refs för att kunna kolla om man klickar utanför filter- eller sorteringspanelerna
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Effekt som hanterar klick utanför filter eller sortering för att stänga dem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false); // Stänger filter om man klickar utanför
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSort(false); // Stänger sortering om man klickar utanför
      }
      // Stäng sökfält om klick är utanför
      if (
        isSearchActive && 
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    };

    // Lägg till en lyssnare för klick utanför
    document.addEventListener("mousedown", handleClickOutside);

    // Städa upp eventlyssnaren när komponenten tas bort
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  const handleSearchIconClick = () => {
    setIsSearchActive(true);
    // Fokusera sökfältet när det aktiveras
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

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
    //SÖKFÄLT
    <div className="compact-filter-container">
      <div className="compact-filter-header">
        <div className="search-icon" onClick={handleSearchIconClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Sök bland Marvel filmer..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}  // Uppdaterar värdet när användaren skriver
          className={`compact-search-input ${isSearchActive ? 'active' : ''}`}
        />
        {searchTerm && (
          <button 
            type="button" 
            className="clear-button" 
            onClick={() => onSearchChange('')}  // När knappen klickas, rensa sökfältet
            aria-label="Rensa sökning"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}

        <div className="compact-filter-buttons">
          {/* Filter-knapp som visar filterpanelen */}
          <button
          className={`compact-filter-button ${showFilters ? "active" : ""}`} 
          onClick={() => {
            setShowFilters(!showFilters);
            setShowSort(false);
          }}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="filter-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          <span>Filtrera</span>
          </button>
                  
          <button
          className={`compact-filter-button ${showSort ? "active" : ""}`} 
          onClick={() => {
            setShowSort(!showSort); 
            setShowFilters(false); 
          }}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="sort-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
            />
          </svg>
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