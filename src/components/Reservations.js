import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt, FaBed, FaUser, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import './Reservations.css';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/reservations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      setReservations(data);
      setError(null);
    } catch (err) {
      setError('Error loading reservations. Please try again later.');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/${reservationId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }

      // Update local state
      setReservations(prevReservations =>
        prevReservations.map(reservation =>
          reservation.id === reservationId
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );
    } catch (err) {
      console.error('Error updating reservation status:', err);
      setError('Failed to update reservation status. Please try again.');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
      const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/reservations/${reservationId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to cancel reservation');
        }

        // Remove from local state
        setReservations(prevReservations =>
          prevReservations.filter(reservation => reservation.id !== reservationId)
        );
      } catch (err) {
        console.error('Error canceling reservation:', err);
        setError('Failed to cancel reservation. Please try again.');
      }
    }
  };

  const filteredReservations = reservations
    .filter(reservation => {
      if (filterStatus !== 'all') {
        return reservation.status === filterStatus;
      }
      return true;
    })
    .filter(reservation =>
      searchQuery
        ? reservation.guest_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reservation.room.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'checked_in': return 'status-checked-in';
      case 'checked_out': return 'status-checked-out';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="reservations-container">
        <div className="loading-indicator">
          <FaSpinner className="spinner" />
          <span>Loading reservations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservations-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="reservations-container">
      <div className="reservations-header">
        <h1>Reservations</h1>
        <div className="filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by guest or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="reservations-grid">
        {filteredReservations.map(reservation => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-header">
              <div className="room-info">
                <FaBed className="icon" />
                <h3>{reservation.room.name}</h3>
              </div>
              <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                {reservation.status.replace('_', ' ')}
              </span>
            </div>

            <div className="reservation-details">
              <div className="detail-item">
                <FaUser className="icon" />
                <span>{reservation.guest_name}</span>
              </div>
              <div className="detail-item">
                <FaCalendarAlt className="icon" />
                <div className="dates">
                  <div>Check-in: {format(new Date(reservation.check_in), 'MMM dd, yyyy')}</div>
                  <div>Check-out: {format(new Date(reservation.check_out), 'MMM dd, yyyy')}</div>
                </div>
              </div>
            </div>

            <div className="reservation-actions">
              {reservation.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange(reservation.id, 'checked_in')}
                  className="action-button check-in"
                >
                  <FaCheck /> Check In
                </button>
              )}
              {reservation.status === 'checked_in' && (
                <button
                  onClick={() => handleStatusChange(reservation.id, 'checked_out')}
                  className="action-button check-out"
                >
                  <FaCheck /> Check Out
                </button>
              )}
              {['confirmed', 'checked_in'].includes(reservation.status) && (
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="action-button cancel"
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="no-reservations">
          <h3>No reservations found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
}

export default Reservations;
