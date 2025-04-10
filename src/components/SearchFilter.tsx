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
  const [isSearchActive, setIsSearchActive] = useState(true); // Alltid aktiv

  // Skapar refs för att kunna kolla om man klickar utanför filter- eller sorteringspanelerna
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchIconRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);

  // Effekt som hanterar klick utanför filter eller sortering för att stänga dem
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kontrollera om klicket var på ikonerna - i så fall ska vi inte stänga panelen här
      // utan låta onClick-hanterarna ta hand om det
      const clickedOnSearchIcon = searchIconRef.current?.contains(event.target as Node);
      const clickedOnFilterButton = filterButtonRef.current?.contains(event.target as Node);
      const clickedOnSortButton = sortButtonRef.current?.contains(event.target as Node);
      
      // Stäng endast filterpanelen om klicket var utanför både panelen och filter-knappen
      if (filtersRef.current && 
          !filtersRef.current.contains(event.target as Node) && 
          !clickedOnFilterButton) {
        setShowFilters(false);
      }
      
      // Stäng endast sorteringspanelen om klicket var utanför både panelen och sort-knappen
      if (sortRef.current && 
          !sortRef.current.contains(event.target as Node) && 
          !clickedOnSortButton) {
        setShowSort(false);
      }
    };

    // Lägg till en lyssnare för klick utanför
    document.addEventListener("mousedown", handleClickOutside);

    // Städa upp eventlyssnaren när komponenten tas bort
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters, showSort]);

  const handleSearchIconClick = () => {
    // Fokusera sökfältet när ikonen klickas
    searchInputRef.current?.focus();
  };

  // Uppdaterad filterklick-hantering för att säkerställa korrekt toggle-beteende
  const handleFilterClick = () => {
    console.log("Filter klickad, nuvarande status:", showFilters); // Debug-logging
    setShowFilters(!showFilters);
    
    // Stäng sorteringspanelen om filterpanelen öppnas
    if (!showFilters) {
      setShowSort(false);
    }
  };

  // Uppdaterad sorteringsklick-hantering för att säkerställa korrekt toggle-beteende
  const handleSortClick = () => {
    console.log("Sortering klickad, nuvarande status:", showSort); // Debug-logging
    setShowSort(!showSort);
    
    // Stäng filterpanelen om sorteringspanelen öppnas
    if (!showSort) {
      setShowFilters(false);
    }
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
      <div className="search-input-wrapper">
        <div 
          className="search-icon" 
          onClick={handleSearchIconClick}
          ref={searchIconRef}
          role="button"
          aria-label="Sök"
          tabIndex={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Sök bland Marvel filmer..."
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
      </div>


        <div className="compact-filter-buttons">
          {/* Filter-knapp som visar filterpanelen */}
          <button
            ref={filterButtonRef}
            className={`compact-filter-button ${showFilters ? "active" : ""}`} 
            onClick={handleFilterClick} // Använd den nya hanteraren för att toggle
            aria-label={showFilters ? "Stäng filtrering" : "Öppna filtrering"}
            aria-expanded={showFilters}
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
            <span className="filter-font">Filtrera</span>
          </button>
                  
          <button
        ref={sortButtonRef}
        className={`compact-filter-button ${showSort ? "active" : ""}`} 
        onClick={handleSortClick}
        aria-label={showSort ? "Stäng sortering" : "Öppna sortering"}
        aria-expanded={showSort}
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
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
            <span className="sort-font">Sortera</span>
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

            {/* Knapp för att rensa alla filter */}
            <div className="compact-filter-actions">
              <button
                className="compact-clear-button"
                onClick={handleClearAll} // Rensar alla filter
              >
                Rensa filter
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