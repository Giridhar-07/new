import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastManager';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

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
        setUser(data.user);
        addToast(`Welcome back${data.user?.first_name ? ', ' + data.user.first_name : ''}!`, 'success');
        navigate('/');
        return { success: true, user: data.user };
      } else {
        const errorMessage = data.error || data.detail || 'Login failed';
        addToast(errorMessage, 'error');
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      addToast('Network error. Please try again.', 'error');
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
    addToast('Successfully logged out!', 'success');
    navigate('/');
  };

  const register = async (formData) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast(data.message || 'Registration successful! Please login.', 'success');
        return true;
      } else {
        let errorMessage = 'Registration failed.';
        
        // Handle various error response formats
        if (data.error) {
          errorMessage = data.error;
        } else if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${messages}`;
            })
            .filter(msg => msg)
            .join('; ');
          
          if (errors) {
            errorMessage = errors;
          }
        }
        
        addToast(errorMessage, 'error');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      addToast('Network error. Please try again.', 'error');
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
