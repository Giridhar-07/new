import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaConcierge,
  FaHotel,
  FaArrowRight,
  FaWifi,
  FaSwimmingPool
} from 'react-icons/fa';
import './LandingPage.css';

function LandingPage() {
  const features = [
    {
      icon: <FaHotel />,
      title: 'Luxury Rooms',
      description: 'Experience comfort in our carefully designed rooms with modern amenities and stunning views.'
    },
    {
      icon: <FaCalendarCheck />,
      title: 'Easy Booking',
      description: 'Simple and secure online booking system with instant confirmation and flexible cancellation.'
    },
    {
      icon: <FaConcierge />,
      title: '24/7 Service',
      description: 'Our dedicated staff is available round the clock to ensure your stay is perfect.'
    },
    {
      icon: <FaWifi />,
      title: 'High-Speed WiFi',
      description: 'Stay connected with complimentary high-speed internet access throughout the property.'
    },
    {
      icon: <FaSwimmingPool />,
      title: 'Leisure Facilities',
      description: 'Enjoy our premium facilities including pool, spa, gym, and restaurant.'
    }
  ];

  return (
    <div className="landing-container">
      <div className="background-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Experience Luxury and Comfort at Its Finest
            </h1>
            <p className="hero-subtitle">
              Discover our exceptional hospitality services and create unforgettable memories in our luxurious accommodations.
            </p>
            <div className="hero-buttons">
              <Link to="/rooms" className="hero-button primary-button">
                View Rooms
                <FaArrowRight />
              </Link>
              <Link to="/contact" className="hero-button secondary-button">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/images/hero-hotel.jpg"
              alt="Luxury Hotel Room"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-content">
          <div className="section-title">
            <h2>Why Choose Us</h2>
            <p>
              Experience the perfect blend of luxury, comfort, and exceptional service
              that sets us apart.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="features-content">
          <div className="section-title">
            <h2>Ready to Experience Luxury?</h2>
            <p>
              Book your stay now and enjoy exclusive benefits and special offers.
            </p>
            <div className="hero-buttons" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/register" className="hero-button primary-button">
                Sign Up Now
                <FaArrowRight />
              </Link>
              <Link to="/rooms" className="hero-button secondary-button">
                Browse Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
