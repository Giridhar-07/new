import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RoomDetails.css';

function RoomDetails() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view room details.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/rooms/${id}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch room details');
        }
        return response.json();
      })
      .then(data => {
        setRoom(data);
        setError('');
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleBooking = () => {
    // Navigate to booking page
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="room-details-container">
        <div className="room-details-card">
          <div className="loading-spinner">
            Loading room details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-details-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-details-container">
        <div className="error-message">
          Room not found
        </div>
      </div>
    );
  }

  return (
    <div className="room-details-container">
      <div className="room-details-card">
        <div className="room-details-header">
          <h1 className="room-details-title">{room.name}</h1>
          <p className="room-details-subtitle">Experience luxury and comfort</p>
        </div>

        <div className="room-details-content">
          <div className="room-details-image-container">
            <img 
              src={room.image} 
              alt={room.name} 
              className="room-details-image"
            />
          </div>

          <div className="room-details-info">
            <p className="room-details-description">
              {room.description}
            </p>

            <div className="room-details-features">
              <div className="feature-item">
                <span className="feature-icon">🛏️</span>
                <span>Comfortable Beds</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚿</span>
                <span>Private Bathroom</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📺</span>
                <span>Smart TV</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">❄️</span>
                <span>Air Conditioning</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📶</span>
                <span>Free Wi-Fi</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🗄️</span>
                <span>Mini Bar</span>
              </div>
            </div>

            <div className="room-price">
              ${room.price} per night
            </div>

            <button 
              onClick={handleBooking}
              className="book-now-button"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
