import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBed,
  FaUsers,
  FaWifi,
  FaArrowRight,
  FaSearch,
  FaFilter,
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import { useToast } from './ToastManager';
import { useNavigate } from 'react-router-dom';
import './Rooms.css';

function Rooms() {
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    capacity: '',
    roomType: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.minPrice) queryParams.append('min_price', filters.minPrice);
      if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice);
      if (filters.capacity) queryParams.append('capacity', filters.capacity);
      if (filters.roomType) queryParams.append('room_type', filters.roomType);

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:8000/api/rooms/?${queryParams}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      addToast('Failed to load rooms. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, token, addToast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'minPrice' || name === 'maxPrice') {
      if (value && parseFloat(value) >= 0) {
        setFilters((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === 'capacity') {
      if (value && parseInt(value) >= 1) {
        setFilters((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    if (
      filters.minPrice &&
      filters.maxPrice &&
      parseFloat(filters.minPrice) > parseFloat(filters.maxPrice)
    ) {
      addToast('Minimum price cannot be greater than maximum price', 'error');
      return;
    }

    setLoading(true);
    fetchRooms();
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      capacity: '',
      roomType: '',
    });
    setLoading(true);
    fetchRooms();
    addToast('Filters cleared', 'success');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: '/rooms' } });
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading luxurious rooms...</p>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h2>Our Rooms</h2>
        <p>Discover our collection of luxurious rooms and suites</p>
        
        <div className="filter-toggle">
          <button onClick={() => setShowFilters(!showFilters)}>
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <form className="filters" onSubmit={handleFilterSubmit}>
            <div className="filter-row">
              <div className="filter-group">
                <label>Min Price (₹)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
              
              <div className="filter-group">
                <label>Max Price (₹)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label>Guests</label>
                <input
                  type="number"
                  name="capacity"
                  value={filters.capacity}
                  onChange={handleFilterChange}
                  min="1"
                />
              </div>

              <div className="filter-group">
                <label>Room Type</label>
                <select
                  name="roomType"
                  value={filters.roomType}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button type="submit" className="apply-filters">
                <FaSearch /> Apply Filters
              </button>
              <button type="button" onClick={clearFilters} className="clear-filters">
                Clear Filters
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="rooms-grid" style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s ease' }}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <img
                  src={room.image ? `http://127.0.0.1:8000${room.image}` : '/images/default-room.jpg'}
                  alt={room.name}
                />
              </div>
              
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="room-type">
                  {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)}
                </p>

                <div className="room-features">
                  <div className="feature">
                    <FaBed />
                    <span>{room.num_beds} {room.num_beds > 1 ? 'Beds' : 'Bed'}</span>
                  </div>
                  <div className="feature">
                    <FaUsers />
                    <span>Max {room.capacity} Guests</span>
                  </div>
                  <div className="feature">
                    <FaWifi />
                    <span>Free WiFi</span>
                  </div>
                </div>

                <div className="room-price">
                  <span className="price">₹{room.price}</span>
                  <span className="per-night">per night</span>
                </div>

                <Link
                  to={`/rooms/${room.id}`}
                  className="view-details-button"
                >
                  View Details <FaArrowRight />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-rooms">
            <div className="no-rooms-content">
              <img src="/images/no-results.svg" alt="No results" className="no-results-image" />
              <h3>No Rooms Found</h3>
              <p>We couldn't find any rooms matching your criteria.</p>
              <button onClick={clearFilters} className="clear-filters">
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;
