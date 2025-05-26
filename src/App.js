import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import RoomDetails from './components/RoomDetails';
import Reservations from './components/Reservations';
import Customers from './components/Customers';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/verify-token/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('customer_id');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('customer_id');
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Layout Component
  const DashboardLayout = ({ children }) => {
    return (
      <div className="dashboard-layout">
        <Sidebar setIsAuthenticated={setIsAuthenticated} />
        <div className="main-content">
          {children}
        </div>
        <Chatbot />
      </div>
    );
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <LandingPage />
              <Chatbot />
            </>
          } />
          <Route path="/login" element={
            !isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />
          } />
          <Route path="/register" element={
            !isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Rooms />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/rooms/:id" element={
            <ProtectedRoute>
              <DashboardLayout>
                <RoomDetails />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/reservations" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reservations />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Customers />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
