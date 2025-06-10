import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/ToastManager";
import "./Login.css";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(credentials);
      if (result.success) {
        addToast(`Welcome back${result.user?.first_name ? ', ' + result.user.first_name : ''}!`, 'success');
        navigate(from, { replace: true });
      } else {
        addToast(result.error || 'Login failed', 'error');
      }
  } catch (error) {
    console.error("Login error:", error);
      let errorMessage = "Failed to login. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid username or password.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Access your hotel account</p>
        <div className="login-divider">
          <span>Please sign in to continue</span>
        </div>
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
            />
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
