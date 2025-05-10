import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('/api/rooms/')
      .then(response => response.json())
      .then(data => setRooms(data))
      .catch(error => console.error('Error fetching rooms:', error));
  }, []);

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Rooms</h2>
          <p className="text-gray-600">Choose your perfect room.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-4">
              <img src="https://via.placeholder.com/300" alt={room.name} className="rounded-t-lg" />
              <h3 className="text-xl font-semibold text-gray-700 mt-2">{room.name}</h3>
              <p className="text-gray-600">{room.description}</p>
              <Link to={`/room/${room.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rooms;
