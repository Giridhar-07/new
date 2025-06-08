import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ isAuthenticated, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isStaff = localStorage.getItem('is_staff') === 'true';
    setUserRole(isStaff ? 'staff' : 'customer');
  }, []);

  const handleLogout = async () => {
    await onLogout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          LuxStay
        </Link>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          
          {isAuthenticated && (
            <Link to="/rooms" onClick={() => setIsMenuOpen(false)}>
              Rooms
            </Link>
          )}
          
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>

          {isAuthenticated && userRole === 'staff' && (
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/chat" onClick={() => setIsMenuOpen(false)}>
              Chat Assistant
            </Link>
          )}

          <div className="auth-buttons">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="logout-button"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="login-button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="register-button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
