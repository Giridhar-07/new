import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaHotel } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/rooms", text: "Rooms" },
    { to: "/contact", text: "Contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header 
      className={`header ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <motion.div 
        className="logo"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/">
          <FaHotel className="logo-icon" />
          <span>Hotel Paradise</span>
        </Link>
      </motion.div>

      <motion.button 
        className="menu-toggle"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        <motion.nav 
          className={`nav-menu ${isMenuOpen ? "active" : ""}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
        <motion.ul>
          {navLinks.map((link, index) => (
            <motion.li 
              key={link.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.to}
                className={location.pathname === link.to ? "active" : ""}
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.text}
                </motion.span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div 
          className="auth-buttons"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isAuthenticated ? (
            <>
              <motion.div 
                className="welcome-text"
                whileHover={{ scale: 1.05 }}
              >
                <FaUser className="user-icon" />
                <span>Welcome, {user?.username}</span>
              </motion.div>
              <motion.button 
                className="logout-button"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="login-button"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </motion.div>
          )}
        </motion.div>
        </motion.nav>
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;
