import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/reservations', label: 'Reservations' }
  ];

  return (
    <>
      <nav className="fixed w-full shadow-lg z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Hotel Name */}
            <div className="flex-shrink-0">
              <Link to="/" className="group">
                <span className="hotel-logo">env Hub</span>
              </Link>
            </div>

            {/* Center Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link text-gray-300 hover:text-white transition-all duration-200 ease-in-out"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons - Right Aligned */}
            <div className="hidden md:flex items-center ml-auto">
              {!localStorage.getItem('token') ? (
                <>
                  <Link to="/login" className="auth-button login">Login</Link>
                  <Link to="/register" className="auth-button register">Register</Link>
                </>
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
        </div>
      </nav>
      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16"></div>
    </>
  );
}

export default Header;
