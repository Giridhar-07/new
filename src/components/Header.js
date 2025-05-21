import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleLogoClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <nav className="bg-gray-800 shadow hover-effect">
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/images/env_hub.png" 
                alt="env Hub Logo" 
                className={`h-8 mr-2 logo-animation ${isAnimating ? 'animate-bounce' : ''}`}
                onClick={handleLogoClick}
              /> {/* Logo */}
              <span className="text-xl font-bold text-white">env Hub</span> {/* Hotel Name */}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link to="/rooms" className="text-gray-300 hover:text-white">Rooms</Link>
            <Link to="/reservations" className="text-gray-300 hover:text-white">Reservations</Link>
            {!localStorage.getItem('token') && (
              <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            )}
            {!localStorage.getItem('token') && (
              <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
            )}
            {localStorage.getItem('token') && (
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }} className="text-gray-300 hover:text-white">Logout</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
