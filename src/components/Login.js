import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  // Check if account is locked
  useEffect(() => {
    const lockoutEnd = localStorage.getItem('lockoutEnd');
    if (lockoutEnd && new Date(lockoutEnd) > new Date()) {
      setIsLocked(true);
      const timeLeft = Math.ceil((new Date(lockoutEnd) - new Date()) / 1000 / 60);
      setError(`Account is temporarily locked. Please try again in ${timeLeft} minutes.`);
    }
  }, []);

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const response = await fetch('http://127.0.0.1:8000/api/refresh-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('token_expiry', data.token_expiry);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>

          <div className="form-footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="register-link">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
