import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import './App.css';

// Protected Route Wrapper Component
const ProtectedRouteWrapper = ({ children, staffOnly = false, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  const isStaff = localStorage.getItem('is_staff') === 'true';
  if (staffOnly && !isStaff) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Redirect customers to home page if they try to access the dashboard
  if (location.pathname === '/dashboard' && !isStaff) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

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
            localStorage.setItem('is_staff', data.is_staff);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('user_email', data.email);
            localStorage.setItem('user_name', data.name);
          } else {
            setIsAuthenticated(false);
            localStorage.clear();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          setIsAuthenticated(false);
          localStorage.clear();
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

  // Layout Component
  const DashboardLayout = ({ children }) => {
    const isStaff = localStorage.getItem('is_staff') === 'true';
    return (
      <>
        {!isStaff && <Header />}
        <div className="dashboard-layout">
          {isStaff && <Sidebar setIsAuthenticated={setIsAuthenticated} />}
          <div className="main-content">
            {children}
          </div>
          <Chatbot />
        </div>
      </>
    );
  };

  // Protected Route Component that uses the wrapper
  const ProtectedRoute = ({ children, staffOnly = false }) => (
    <ProtectedRouteWrapper staffOnly={staffOnly} isAuthenticated={isAuthenticated}>
      {children}
    </ProtectedRouteWrapper>
  );

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
            !isAuthenticated ? (
              <Login setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to={localStorage.getItem('is_staff') === 'true' ? '/dashboard' : '/'} />
            )
          } />
          <Route path="/register" element={
            !isAuthenticated ? (
              <Register setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to={localStorage.getItem('is_staff') === 'true' ? '/dashboard' : '/'} />
            )
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute staffOnly>
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
            <ProtectedRoute staffOnly>
              <DashboardLayout>
                <Customers />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute staffOnly>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/contact" element={
            <DashboardLayout>
              <Contact />
            </DashboardLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
