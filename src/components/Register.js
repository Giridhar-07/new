import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useSpring, animated } from "react-spring";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/ToastManager";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
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

  const [passwordStrength, setPasswordStrength] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Password requirements
  const PASSWORD_REQUIREMENTS = [
    { text: "At least 8 characters long", regex: /.{8,}/ },
    { text: "Contains a number", regex: /\d/ },
    { text: "Contains an uppercase letter", regex: /[A-Z]/ },
    { text: "Contains a lowercase letter", regex: /[a-z]/ },
  ];

  useEffect(() => {
    if (formData.password) {
      const metRequirements = PASSWORD_REQUIREMENTS.filter(req =>
        req.regex.test(formData.password)
      );
      setPasswordStrength(metRequirements);
    } else {
      setPasswordStrength([]);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (Object.values(formData).some(value => !value)) {
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

    if (!termsAccepted) {
      addToast("Please accept the Terms of Service", "error");
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
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          const errors = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          errorMessage = errors || errorMessage;
        }
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
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us to access exclusive features</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-grid">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
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
              <div className="input-icon-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
          </div>

          <div className="terms-agreement">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <label htmlFor="terms">
              I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`} 
            disabled={isLoading || !termsAccepted || passwordStrength.length !== PASSWORD_REQUIREMENTS.length}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </animated.div>
    </div>
  );
}

export default Register;
