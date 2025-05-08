import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="relative bg-primary overflow-hidden h-screen">
      <img
        src="http://127.0.0.1:8000/media/rooms/hotel_room.jpg"
        alt="Hotel Room"
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-4">Experience Hospitality Like Never Before</h2>
          <p className="text-lg text-gray-300 mb-8">Discover unparalleled luxury and personalized service at our exquisite hotel.</p>
          <Link to="/reservations" className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-full mt-4 inline-block">
            Discover Rooms
          </Link>
        </div>
      </div>

      {/* Add rooms section here */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms && rooms.map((room) => (
              <div key={room.id} className="bg-gray-700 rounded-lg shadow-md p-4">
                <img src="https://via.placeholder.com/300" alt={room.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{room.name}</h3>
                <p className="text-gray-300 mb-4">{room.description}</p>
                <div className="flex justify-between">
                  <Link to={`/rooms/${room.id}`} className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded">View Details</Link>
                  <Link to={`/reservations?room=${room.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Book Now</Link>
                </div>
              </div>
            ))
}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
