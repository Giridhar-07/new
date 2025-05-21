import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/reservations', label: 'Reservations' }
  ];

  return (
    <nav className="fixed w-full bg-gray-800 shadow hover-effect z-50">
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Hotel Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/images/env_hub.png" 
                alt="env Hub Logo" 
                className={`h-10 mr-3 logo-animation ${isAnimating ? 'animate-bounce' : ''}`}
                onClick={handleLogoClick}
              />
              <span className="text-2xl font-bold gradient-text">env Hub</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden burger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`burger-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`burger-line ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`burger-line ${isMenuOpen ? 'open' : ''}`}></div>
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
            {!localStorage.getItem('token') ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="auth-button login">Login</Link>
                <Link to="/register" className="auth-button register">Register</Link>
              </div>
            ) : (
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }} 
                className="auth-button logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!localStorage.getItem('token') ? (
            <div className="flex flex-col space-y-2 mt-4">
              <Link to="/login" className="mobile-auth-button login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-auth-button register" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </div>
          ) : (
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
                setIsMenuOpen(false);
              }} 
              className="mobile-auth-button logout mt-4"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
