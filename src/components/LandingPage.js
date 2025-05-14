import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    { id: 1, content: "Exceptional service and luxurious accommodations. Highly recommended!", author: "John Doe", image: "https://via.placeholder.com/50" },
    { id: 2, content: "The perfect getaway. Beautiful surroundings and top-notch amenities.", author: "Jane Smith", image: "https://via.placeholder.com/50" },
    { id: 3, content: "A truly unforgettable experience. The staff went above and beyond to make our stay special.", author: "David Lee", image: "https://via.placeholder.com/50" }
  ];

  const features = [
    { id: 1, title: "Luxurious Rooms", description: "Experience ultimate comfort in our elegantly designed rooms.", image: "https://via.placeholder.com/350x200" },
    { id: 2, title: "Fine Dining", description: "Savor exquisite cuisine at our award-winning restaurants.", image: "https://via.placeholder.com/350x200" },
    { id: 3, title: "Relaxing Spa", description: "Indulge in rejuvenating treatments at our serene spa.", image: "https://via.placeholder.com/350x200" }
  ];

  return (
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">Experience Hospitality Like Never Before</h2>
            <p className="text-lg text-gray-300 mb-8">Discover unparalleled luxury and personalized service at our exquisite hotel.</p>
            <Link to="/rooms" className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-full mt-4 inline-block">
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
                    <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover rounded-md mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
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
                    <img src={testimonial.image} alt={testimonial.author} className="rounded-full w-20 h-20 mx-auto mb-4" />
                    <p className="text-gray-300 italic mb-4">"{testimonial.content}"</p>
                    <p className="text-white font-semibold">- {testimonial.author}</p>
                  </div>
              ))}
            </Slider>
          </div>
        </section>
      </div>
  );
}

export default LandingPage;
