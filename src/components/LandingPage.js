import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './LandingPage.css';

function LandingPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
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
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

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
      <div className="relative bg-primary overflow-hidden landing-page" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&q=80&w=2000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4 animated-heading">Experience Hospitality Like Never Before</h2>
            <p className="text-lg text-gray-300 mb-8 animated-paragraph">Discover unparalleled luxury and personalized service at our exquisite hotel.</p>
            <Link to="/rooms" className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-full mt-4 inline-block animated-button">
              Discover Rooms
            </Link>
          </div>
        </div>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Hotel Features</h2>
            <Slider {...settings}>
              {features.map(feature => (
                  <div key={feature.id} className="text-center">
                    <div className="px-4">
                      <div className="bg-gray-900 rounded-lg p-4 transform transition-transform hover:scale-105 feature-card">
                        <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover rounded-lg mb-4 shadow-lg" />
                        <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300 text-lg">{feature.description}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </Slider>
          </div>
        </section>

        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Testimonials</h2>
            <Slider {...settings}>
              {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="text-center">
                    <div className="bg-gray-900 rounded-lg p-8 mx-4 transform transition-transform hover:scale-105 testimonial-card">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="rounded-full w-24 h-24 mx-auto mb-6 object-cover border-4 border-accent shadow-lg" 
                      />
                      <p className="text-gray-300 italic mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
                      <div className="text-center">
                        <p className="text-white font-semibold text-xl mb-1">{testimonial.author}</p>
                        <p className="text-accent text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
  );
}

export default LandingPage;
