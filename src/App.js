import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Rooms from './components/Rooms';
import RoomDetails from './components/RoomDetails';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import { ToastProvider } from './components/ToastManager';
import useAuth from './hooks/useAuth';
import './App.css';

function App() {
  const { isAuthenticated, setIsAuthenticated, logout } = useAuth();

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default App;
