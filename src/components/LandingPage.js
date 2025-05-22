import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const features = [
    {
      id: 1,
      title: "Luxurious Rooms",
      description: "Experience ultimate comfort in our elegantly designed rooms with modern amenities and breathtaking views.",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&q=80&w=1000"
    },
    {
      id: 2,
      title: "Fine Dining",
      description: "Savor exquisite cuisine at our award-winning restaurants prepared by world-class chefs using finest ingredients.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&q=80&w=1000"
    },
    {
      id: 3,
      title: "Wellness & Spa",
      description: "Rejuvenate your senses with our premium spa treatments and state-of-the-art wellness facilities.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&q=80&w=1000"
    }
  ];

  const testimonials = [
    {
      id: 1,
      content: "An exceptional experience that exceeded all expectations. The attention to detail and personalized service made our stay truly memorable.",
      author: "John Anderson",
      title: "Business Traveler",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&q=80&w=200"
    },
    {
      id: 2,
      content: "The perfect blend of luxury and comfort. From the amazing restaurants to the spa services, everything was absolutely world-class.",
      author: "Emma Thompson",
      title: "Travel Blogger",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&q=80&w=200"
    },
    {
      id: 3,
      content: "A stunning property with impeccable service. The staff went above and beyond to ensure our stay was perfect in every way.",
      author: "Michael Chen",
      title: "Luxury Travel Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&q=80&w=200"
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Experience Luxury Beyond Compare
          </h1>
          <p className="hero-subtitle">
            Discover a world of elegance, comfort, and exceptional service at our world-class hotel
          </p>
          <Link to="/rooms" className="hero-button">
            Explore Our Rooms
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Experience World-Class Amenities</h2>
        <div className="feature-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-image-container">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="feature-image"
                />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Guests Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <p className="testimonial-content">"{testimonial.content}"</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="author-image"
                />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.author}</h4>
                  <p className="author-title">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
