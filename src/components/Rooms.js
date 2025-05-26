import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBed, 
  FaUsers, 
  FaWifi, 
  FaArrowRight, 
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import './Rooms.css';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    capacity: '',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRooms();
  }, [filters, searchTerm]);

  const fetchRooms = async () => {
    try {
      let url = 'http://127.0.0.1:8000/api/rooms/';
      const params = new URLSearchParams();

      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.capacity) params.append('max_occupants', filters.capacity);
      if (filters.type !== 'all') params.append('type', filters.type);
      if (searchTerm) params.append('search', searchTerm);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const roomTypes = ['all', 'standard', 'deluxe', 'suite'];

  if (loading) {
    return (
      <div className="rooms-container">
        <div className="loading-screen">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="rooms-content">
        <div className="rooms-header">
          <h1 className="rooms-title">Our Rooms</h1>
          <p className="rooms-subtitle">
            Discover our collection of luxurious rooms and suites
          </p>
        </div>

        <div className="rooms-actions">
          <form onSubmit={handleSearch} className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </form>

          <div className="filters">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {roomTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <input
                type="number"
                name="capacity"
                placeholder="Guests"
                value={filters.capacity}
                onChange={handleFilterChange}
                className="filter-input"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image-container">
                <img
                  src={room.image || '/images/default-room.jpg'}
                  alt={room.name}
                  className="room-image"
                />
              <div className="room-tag">
                {room.room_type ? room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1) : ''}
              </div>
              </div>

              <div className="room-content">
                <h3 className="room-name">{room.name}</h3>
                <p className="room-description">{room.description}</p>

                <div className="room-details">
                  <div className="detail-item">
                    <FaBed className="detail-icon" />
                    <span>{room.num_beds} {room.num_beds > 1 ? 'Beds' : 'Bed'}</span>
                  </div>
                  <div className="detail-item">
                    <FaUsers className="detail-icon" />
                    <span>{room.max_occupants} Guests</span>
                  </div>
                  <div className="detail-item">
                    <FaWifi className="detail-icon" />
                    <span>{room.wifi ? 'Free WiFi' : 'No WiFi'}</span>
                  </div>
                </div>

                <div className="room-price">
                  <span className="price-amount">${room.price}</span>
                  <span className="price-period">per night</span>
                </div>

                <Link 
                  to={`/rooms/${room.id}`}
                  className="view-details-button"
                >
                  View Details
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="no-results">
            <h3>No rooms found matching your criteria</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;
