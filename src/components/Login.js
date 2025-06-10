import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useSpring, animated } from "react-spring";
import useAuth from "../hooks/useAuth";
import { useToast } from "./ToastManager";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

const ThreeDBackground = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#3b82f6" opacity={0.1} transparent />
      </mesh>
    </Canvas>
  );
};

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

  const [animation, setAnimation] = useSpring(() => ({
    opacity: 1,
    transform: "translateY(0px)",
  }));

  useEffect(() => {
    setAnimation({
      opacity: 1,
      transform: "translateY(0px)",
      from: { opacity: 0, transform: "translateY(50px)" },
    });
  }, []);

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
    <div className="auth-container">
      <div className="auth-background">
        <ThreeDBackground />
      </div>

      <animated.div style={animation} className="auth-box">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Access your hotel account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-grid">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </animated.div>
    </div>
  );
}

export default Login;
