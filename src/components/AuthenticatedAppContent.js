import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import LandingPage from './LandingPage';
import Rooms from './Rooms';
import RoomDetails from './RoomDetails';
import Login from './Login';
import Register from './Register';
import Contact from './Contact';
import useAuth from '../hooks/useAuth';
import '../App.css';

function AuthenticatedAppContent() {
  const { isAuthenticated, setIsAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} onLogout={logout} />
      <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route
              path="/login"
              element={
                <Login
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route path="/contact" element={<Contact />} />
          </Routes>
      </main>
    </div>
  );
}

export default AuthenticatedAppContent;
