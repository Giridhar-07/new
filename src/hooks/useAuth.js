import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastManager';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const showToast = useToast();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const success = await refreshAccessToken();
          if (!success) {
            throw new Error('Token refresh failed');
          }
          return checkAuth();
        }
        throw new Error('Authentication failed');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [checkAuth]);

  const login = async ({ username, password }) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setIsAuthenticated(true);
        showToast('Successfully logged in!', 'success');
        navigate('/');
        return { success: true };
      } else {
        if (data.is_locked) {
          const remainingTime = Math.ceil(
            (new Date(data.locked_until) - new Date()) / (1000 * 60)
          );
          showToast(
            `Account locked. Please try again in ${remainingTime} minutes.`,
            'error'
          );
          return {
            success: false,
            error: 'Account locked',
            lockedUntil: data.locked_until,
          };
        }
        showToast(data.detail || 'Login failed', 'error');
        return {
          success: false,
          error: data.detail || 'Login failed',
        };
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
      return {
        success: false,
        error: 'Network error',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
    showToast('Successfully logged out!', 'success');
    navigate('/');
  };

  const register = async ({ username, email, password }) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Registration successful! Please login.', 'success');
        return true;
      } else {
        const errorMessage = data.detail || 
          Object.values(data).flat().join(' ');
        showToast(errorMessage, 'error');
        return false;
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    user,
    login,
    logout,
    register,
    token: localStorage.getItem('accessToken'),
  };
}

export default useAuth;
