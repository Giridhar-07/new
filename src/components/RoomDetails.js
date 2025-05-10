import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetch(`/api/rooms/${id}/`)
      .then(response => response.json())
      .then(data => setRoom(data))
      .catch(error => console.error('Error fetching room details:', error));
  }, [id]);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{room.name}</h1>
        <p className="text-gray-600 mb-4">{room.description}</p>
        <p className="text-gray-600">Number of beds: {room.num_beds}</p>
        <p className="text-gray-600">AC: {room.ac ? 'Yes' : 'No'}</p>
        <p className="text-gray-600">Allowed guests: {room.max_occupants}</p>
        <p className="text-gray-600">Pet policy: {room.pets_allowed ? 'Yes' : 'No'}</p>
        <p className="text-gray-600">Wi-Fi: {room.wifi ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

export default RoomDetails;
