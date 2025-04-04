import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Stäng menyn när man navigerar eller ändrar storlek på skärmen
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Hantera responsivitet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      {/* Logotyp till vänster */}
      <div className="logo">
      <img src="/logo.png" alt="Marvelous Ratings Logo" className="logo" />
        <Link to="/"></Link>
      </div>

      {/* Centrerade länkar */}
      <div className={`nav-links-container ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}  // Stänger menyn när man klickar på en länk
            >
              Hem
            </Link>
          </li>
          <li>
  <Link 
    to="/marvel-timeline" 
    className={location.pathname === '/marvel-timeline' ? 'active' : ''}
    onClick={() => setIsMenuOpen(false)}
  >
    Marvel timline
  </Link>
</li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}  // Stänger menyn när man klickar på en länk
            >
              Marvel Historia
            </Link>
          </li>
        </ul>
      </div>

      {/* Hamburgermeny för mobila enheter */}
      <div 
        className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
