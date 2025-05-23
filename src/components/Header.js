import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo">
          LuxuryStay
        </Link>

        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="mobile-menu-icon"></span>
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/rooms" 
            className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}
          >
            Rooms
          </Link>
          <Link 
            to="/reservations" 
            className={`nav-link ${isActive('/reservations') ? 'active' : ''}`}
          >
            Reservations
          </Link>
          {!localStorage.getItem('token') && (
            <Link 
              to="/login" 
              className="nav-link login-nav-link"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
