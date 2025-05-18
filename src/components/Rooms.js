import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreeJSScene from './ThreeJSScene';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view rooms.');
      setRooms([]); // Ensure rooms is an empty array
      return;
    }

    fetch('http://127.0.0.1:8000/api/rooms/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          // If response is not OK, try to read the error message from the body
          return response.json().then(err => { throw new Error(err.detail || 'Failed to fetch rooms'); });
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched rooms data:', data);
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setRooms(data);
          setError(''); // Clear any previous errors
        } else {
          console.error('Fetched data is not an array:', data);
          setError('Unexpected data format received.');
          setRooms([]);
        }
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setError(error.message || 'Failed to load rooms. Please log in.');
        setRooms([]); // Ensure rooms is an empty array on error
      });
  }, []);

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Rooms</h2>
          <p className="text-gray-600">Choose your perfect room.</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!error && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transform transition duration-300 hover:scale-105">
                <img src={room.image} alt={room.name} className="w-full h-48 object-cover mb-2" />
                <h3 className="text-xl font-semibold text-gray-700 mt-2">{room.name}</h3>
                <p className="text-gray-600">{room.description}</p>
                <Link to={`/room/${room.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
        {!error && rooms.length === 0 && <p className="text-gray-600 text-center">No rooms available.</p>}
      </div>
    </div>
  );
}

export default Rooms;
