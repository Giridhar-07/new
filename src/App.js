import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import Reservations from './components/Reservations';
import RoomDetails from './components/RoomDetails';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={token ? <LandingPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservations" element={token ? <Reservations /> : <Navigate to="/login" />} />
        <Route path="/room/:id" element={token ? <RoomDetails /> : <Navigate to="/login" />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
