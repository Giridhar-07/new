import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './LandingPage.css';

function LandingPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const reveal = () => {
      revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    setIsLoaded(true);
    reveal(); // Initial check

    const token = localStorage.getItem('token');
    fetch('http://127.0.0.1:8000/api/rooms/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          console.error("API returned non-array data:", data);
        }
      })
      .catch(error => console.error("Error fetching rooms:", error));

    // Cleanup
    return () => window.removeEventListener('scroll', reveal);
  }, []);

  const testimonials = [
    { 
      id: 1, 
      content: "Exceptional service and luxurious accommodations. The attention to detail and personalized care made our stay unforgettable.", 
      author: "John Anderson",
      title: "Business Traveler",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&q=80&w=200"
    },
    { 
      id: 2, 
      content: "The perfect getaway. Beautiful surroundings, incredible dining, and the spa services were absolutely world-class.", 
      author: "Emma Thompson",
      title: "Travel Blogger",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&q=80&w=200"
    },
    { 
      id: 3, 
      content: "A truly remarkable experience. The staff anticipated our every need and the amenities exceeded all expectations.", 
      author: "Michael Chen",
      title: "Luxury Travel Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&q=80&w=200"
    }
  ];

  const features = [
    { 
      id: 1, 
      title: "Luxurious Rooms", 
      description: "Experience ultimate comfort in our elegantly designed rooms.", 
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&q=80&w=1000" 
    },
    { 
      id: 2, 
      title: "Fine Dining", 
      description: "Savor exquisite cuisine at our award-winning restaurants.", 
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&q=80&w=1000" 
    },
    { 
      id: 3, 
      title: "Relaxing Spa", 
      description: "Indulge in rejuvenating treatments at our serene spa.", 
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&q=80&w=1000" 
    }
  ];

  return (
    <div className="landing-page parallax" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&q=80&w=2000')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 gradient-overlay"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-6xl font-bold text-white mb-6 animated-heading text-enhanced tracking-wide blurred-text">
            Experience Luxury Beyond Compare
          </h2>
          <p className="text-2xl text-gray-200 mb-12 animated-paragraph max-w-2xl mx-auto text-enhanced leading-relaxed blurred-text">
            Discover unparalleled comfort and exceptional service in our world-class hotel.
          </p>
          <Link to="/rooms" className="animated-button text-gray-900 font-bold py-6 px-16 rounded-full mt-6 inline-block">
            Explore Our Rooms
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 content-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-16 text-center reveal text-enhanced">
            Experience World-Class Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map(feature => (
              <div key={feature.id} className="reveal">
                <div className="feature-card bg-gray-900/90 rounded-lg p-6 backdrop-blur-sm">
                  <div className="overflow-hidden rounded-lg mb-6">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 content-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-16 text-center reveal text-enhanced">
            What Our Guests Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="reveal">
                <div className="testimonial-card bg-gray-900/90 rounded-lg p-8 backdrop-blur-sm">
                  <div className="mb-8">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="rounded-full w-24 h-24 mx-auto object-cover border-4 border-accent shadow-lg"
                    />
                  </div>
                  <p className="text-gray-300 italic mb-8 text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="text-center">
                    <p className="text-white font-semibold text-xl mb-2">{testimonial.author}</p>
                    <p className="text-accent">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
