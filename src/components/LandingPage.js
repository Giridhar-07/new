import React, { useEffect } from 'react';
import './LandingPage.css';

function LandingPage() {
  useEffect(() => {
    // Parallax animation for the hero section
    const handleScroll = () => {
      const heroImage = document.querySelector('.hero-image img');
      const scrollPosition = window.pageYOffset;

      heroImage.style.transform = `translateY(${scrollPosition * 0.2}px) scale(1.1)`;
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      <nav className="navbar">
<div className="navbar-brand">ENV'S Coder Hub</div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <a href="/">Home</a>
          </li>
          <li className="navbar-item">
            <a href="/reservation">Reservation</a>
          </li>
          <li className="navbar-item dropdown">
            <a href="/rooms">Rooms</a>
            <ul className="dropdown-menu">
              <li>
                <a href="/standard-room">Standard Room</a>
              </li>
              <li>
                <a href="/deluxe-room">Deluxe Room</a>
              </li>
              <li>
                <a href="/suite">Suite</a>
              </li>
            </ul>
          </li>
          <li className="navbar-item">
            <a href="/contact">Contact</a>
          </li>
          <li className="navbar-item">
            <a href="/news">News</a>
          </li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our Hotel</h1>
          <p>Experience luxury and comfort.</p>
          <button className="book-now-button">Book Now</button>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/600x400" alt="Hotel Room" />
        </div>
      </section>

      <section className="rooms">
        <h2>Our Rooms</h2>
        <div className="room-card">
          <img src="https://via.placeholder.com/300" alt="Standard Room" />
          <h3>Standard Room</h3>
          <p>Cozy and comfortable room with essential amenities.</p>
          <button>View Details</button>
          <button>Book Now</button>
        </div>
        <div className="room-card">
          <img src="https://via.placeholder.com/300" alt="Deluxe Room" />
          <h3>Deluxe Room</h3>
          <p>Spacious room with enhanced amenities and a city view.</p>
          <button>View Details</button>
          <button>Book Now</button>
        </div>
        <div className="room-card">
          <img src="https://via.placeholder.com/300" alt="Suite" />
          <h3>Suite</h3>
          <p>Luxurious suite with a separate living area and premium amenities.</p>
          <button>View Details</button>
          <button>Book Now</button>
        </div>
      </section>

      <section className="testimonials">
        <h2>Testimonials</h2>
        <div className="testimonial-slider">
          <div className="testimonial">
            <p>"Excellent service and comfortable rooms. Highly recommended!"</p>
            <p>- John Doe</p>
          </div>
          <div className="testimonial">
            <p>"The hotel exceeded my expectations. The staff was friendly and helpful."</p>
            <p>- Jane Smith</p>
          </div>
          <div className="testimonial">
            <p>"The location was perfect, but the breakfast could be improved."</p>
            <p>- Peter Jones</p>
          </div>
        </div>
      </section>

      <div className="reservation-calendar">
        <h3>Reservation Calendar</h3>
        <p>Select your dates:</p>
        {/* Add calendar component here */}
      </div>
    </div>
  );
}

export default LandingPage;
