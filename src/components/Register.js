import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/login';
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('An error occurred during registration');
      console.error('Registration error:', error);
    }
  };

  return (
    <main className="register-container">
      <div className="register-form">
        <h2 className="register-title">Create Account</h2>
        <p className="text-gray-600 mb-8 text-center text-lg">
          Join us to start booking your dream stays
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="username" className="register-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="register-input"
              placeholder="Choose your username"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="register-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="register-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="register-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}

export default Register;
