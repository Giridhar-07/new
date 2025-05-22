import React, { useState } from 'react';
import './Login.css';

function Login() {
  console.log('Login component rendered');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Login form submitted');
    console.log('Username:', username, 'Password:', password);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      console.log('Login API response status:', response.status);
      const data = await response.json();
      console.log('Login API response data:', data);

      if (response.ok) {
        console.log('Login successful, storing token:', data.access);
        localStorage.setItem('token', data.access);
        // Redirect to the home page or another protected route
        window.location.href = '/rooms';
      } else {
        console.error('Login failed:', data.error);
        // Display an error message
        alert(data.error);
      }
    } catch (error) {
      console.error('Error during login fetch:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <main className="login-container">
      <div className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <p className="text-gray-600 mb-8 text-center text-lg">Enter your credentials to access your account</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="username" className="login-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="login-button"
            onClick={() => console.log('Login button clicked')}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
