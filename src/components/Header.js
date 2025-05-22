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
      <nav className="fixed w-full bg-gray-800 shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo and Hotel Name */}
            <div className="flex-shrink-0">
              <Link to="/" className="group">
                <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">env Hub</span>
              </Link>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link text-gray-300 hover:text-white transition-all duration-200 ease-in-out"
                >
                  {item.label}
                </Link>
              ))}
              {!localStorage.getItem('token') ? (
                <div className="flex items-center space-x-3">
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

        </div>
      </nav>
{/* Spacer to prevent content from being hidden under fixed header */}
<div className="h-12"></div>
    </>
  );
}

export default Header;
