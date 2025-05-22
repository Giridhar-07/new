import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Reservations.css';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your reservations');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/api/reservations/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }
        return response.json();
      })
      .then(data => {
        setReservations(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message || 'Failed to load reservations');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getReservationStatus = (checkIn, checkOut) => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (now < checkInDate) {
      return 'upcoming';
    } else if (now > checkOutDate) {
      return 'completed';
    }
    return 'active';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="reservations-container">
        <div className="reservations-content">
          <div className="reservations-header">
            <h2 className="reservations-title">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservations-container">
        <div className="reservations-content">
          <div className="empty-state">
            <p className="empty-message">{error}</p>
            <Link to="/login" className="new-reservation-button">
              Login to View Reservations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      <div className="reservations-content">
        <div className="reservations-header">
          <h2 className="reservations-title">Your Reservations</h2>
          <p className="reservations-subtitle">
            Manage and view your booking details
          </p>
        </div>

        {reservations.length > 0 ? (
          <div className="reservations-grid">
            {reservations.map(reservation => {
              const status = getReservationStatus(reservation.check_in, reservation.check_out);
              return (
                <div key={reservation.id} className="reservation-card">
                  <h3 className="room-name">{reservation.room.name}</h3>
                  <div className="reservation-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Check-in:</span>
                      <span className="detail-value">{formatDate(reservation.check_in)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-label">Check-out:</span>
                      <span className="detail-value">{formatDate(reservation.check_out)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-label">Total:</span>
                      <span className="detail-value">${reservation.total_price}</span>
                    </div>
                  </div>
                  <div className={`status-badge status-${status}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-message">No reservations found.</p>
            <Link to="/rooms" className="new-reservation-button">
              Make a Reservation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservations;
