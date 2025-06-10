import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/ToastManager";
import "./Login.css";

// Password requirements
const PASSWORD_REQUIREMENTS = [
  { text: "At least 8 characters long", regex: /.{8,}/ },
  { text: "Contains a number", regex: /\d/ },
  { text: "Contains an uppercase letter", regex: /[A-Z]/ },
  { text: "Contains a lowercase letter", regex: /[a-z]/ },
];

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [passwordStrength, setPasswordStrength] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

      );
      setPasswordStrength(metRequirements);
    } else {
      setPasswordStrength([]);
    }
  }, [formData.password]);

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      addToast("All fields are required", "error");
      return false;
    }

    if (!formData.email.includes('@')) {
      addToast("Please enter a valid email address", "error");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match!", "error");
      return false;
    }

    if (passwordStrength.length < PASSWORD_REQUIREMENTS.length) {
      addToast("Please meet all password requirements", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        addToast("Registration successful! Please log in.", "success");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to register. Please try again.";
      
      if (error.response?.data?.detail) {
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
        <h2>Create Account</h2>
        <p className="login-subtitle">Join us to access exclusive features</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
            <div className="password-requirements">
              {PASSWORD_REQUIREMENTS.map((req, index) => (
                <div
                  key={index}
                  className={`requirement ${
                    passwordStrength.find(r => r.text === req.text) ? 'met' : ''
                  }`}
                >
                  {req.text}
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p className="register-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
