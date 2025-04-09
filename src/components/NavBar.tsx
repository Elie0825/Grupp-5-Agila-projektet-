import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css"; // Kontrollera att sökvägen är korrekt

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  // Stäng menyn när man navigerar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Hantera klick utanför menyn och anpassa för skärmstorlek
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        navRef.current && 
        !navRef.current.contains(event.target as Node) &&
        window.innerWidth <= 768
      ) {
        setIsMenuOpen(false);
      }
    };

    // Lås scroll när menyn är öppen på mobil
    if (isMenuOpen && window.innerWidth <= 768) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove('scroll-lock');
    };
  }, [isMenuOpen]);

  // Toggle-funktion för hamburgarmenyn
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" ref={navRef}>
      {/* Logotyp */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo.png" alt="Marvelous Ratings Logo" />
        </Link>
      </div>

      {/* Hamburgermeny för mobil */}
      <div 
        className={`menu-toggle ${isMenuOpen ? "active" : ""}`} 
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Stäng meny" : "Öppna meny"}
        role="button"
        tabIndex={0}
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation container med länkar */}
      <div 
        className={`nav-links-container ${isMenuOpen ? "open" : ""}`}
        aria-hidden={!isMenuOpen}
      >
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              Filmer
            </Link>
          </li>
          <li>
            <Link 
              to="/characters" 
              className={location.pathname === "/characters" ? "active" : ""}
            >
              Karaktärer
            </Link>
          </li>
          <li>
            <Link 
              to="/marvel-historia" 
              className={location.pathname === "/marvel-historia" ? "active" : ""}
            >
              Marvels Historia
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;