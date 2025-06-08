import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastManager';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const showToast = useToast();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      showToast('Account is temporarily locked. Please try again later.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setIsAuthenticated(true);
        showToast('Successfully logged in!', 'success');
        navigate('/');
      } else {
        const errorMessage = data.error || `Login failed. ${data.attempts_remaining} attempts remaining.`;
        showToast(errorMessage, 'error');
        
        if (data.locked_until) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
          }, new Date(data.locked_until) - new Date());
        }
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={isLocked}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={isLocked}
            />
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isLocked || isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
