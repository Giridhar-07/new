import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view room details.');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/rooms/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.detail || 'Failed to fetch room details'); });
        }
        return response.json();
      })
      .then(data => {
        setRoom(data);
        setError('');
      })
      .catch(error => {
        console.error('Error fetching room details:', error);
        setError(error.message || 'Failed to load room details. Please log in.');
      });
  }, [id]);

  if (error) {
    return <div className="container mx-auto mt-8"><p className="text-red-500 text-center">{error}</p></div>;
  }

  if (!room) {
    return <div className="container mx-auto mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{room.name}</h1>
        <p className="text-gray-600 mb-4">{room.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700"><span className="font-semibold">Number of beds:</span> {room.num_beds}</p>
            <p className="text-gray-700"><span className="font-semibold">Allowed guests:</span> {room.max_occupants}</p>
            <p className="text-gray-700"><span className="font-semibold">Price per night:</span> ${room.price_per_night}</p>
          </div>
          <div>
            <p className="text-gray-700"><span className="font-semibold">AC:</span> {room.ac ? 'Yes' : 'No'}</p>
            <p className="text-gray-700"><span className="font-semibold">Pet policy:</span> {room.pets_allowed ? 'Yes' : 'No'}</p>
            <p className="text-gray-700"><span className="font-semibold">Wi-Fi:</span> {room.wifi ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
