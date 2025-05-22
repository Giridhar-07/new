import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Rooms.css';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view rooms.');
      setRooms([]);
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/api/rooms/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.detail || 'Failed to fetch rooms'); });
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRooms(data);
          setError('');
        } else {
          console.error('Fetched data is not an array:', data);
          setError('Unexpected data format received.');
          setRooms([]);
        }
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setError(error.message || 'Failed to load rooms. Please log in.');
        setRooms([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="rooms-container">
        <div className="container mx-auto">
          <div className="rooms-header">
            <h2 className="rooms-title">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="container mx-auto">
        <div className="rooms-header">
          <h2 className="rooms-title">Discover Our Luxurious Rooms</h2>
          <p className="rooms-subtitle">
            Experience comfort and elegance in our carefully curated accommodations
          </p>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : rooms.length > 0 ? (
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-image-container">
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="room-image"
                  />
                </div>
                <div className="room-content">
                  <h3 className="room-name">{room.name}</h3>
                  <p className="room-description">
                    {room.description}
                  </p>
                  <Link 
                    to={`/room/${room.id}`} 
                    className="view-details-button"
                  >
                    Explore Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">
            No rooms are currently available. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
}

export default Rooms;
