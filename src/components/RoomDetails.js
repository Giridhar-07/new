import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBed, FaUsers, FaWifi, FaTv, FaSnowflake, FaParking, FaArrowRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import DatePicker from './DatePicker';
import useAvailability from '../hooks/useAvailability';
import './RoomDetails.css';

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const amenitiesRef = useRef(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [guests, setGuests] = useState(1);
  const { isAvailable, isLoading: availabilityLoading, totalPrice, blockedDates, error: availabilityError } = useAvailability(
    id,
    dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : null,
    dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null
  );

  useEffect(() => {
    // Parallax effect for header image
    const handleScroll = () => {
      if (headerRef.current) {
        const scrolled = window.scrollY;
        headerRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for amenities animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const amenityItems = entry.target.querySelectorAll('.amenity-item');
            amenityItems.forEach((item, index) => {
              item.style.setProperty('--index', index);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (amenitiesRef.current) {
      observer.observe(amenitiesRef.current);
    }

    return () => observer.disconnect();
  }, [room]);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/rooms/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRoom(data);
        } else if (response.status === 401) {
          // Handle unauthorized - maybe redirect to login
          console.error('Unauthorized to fetch room details');
          navigate('/login'); // Redirect to login page
        } else {
          console.error('Error fetching room details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id, navigate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAvailable) {
      alert('Selected dates are not available');
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({
            room_id: id,
            check_in_date: format(dateRange.from, 'yyyy-MM-dd'),
            check_out_date: format(dateRange.to, 'yyyy-MM-dd'),
            guest_count: guests,
          }),
      });

      if (response.ok) {
        navigate('/reservations');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  if (loading) {
    return (
      <div className="room-details-container">
        <div className="loading-indicator">Loading...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-details-container">
        <div className="error-message">Room not found</div>
      </div>
    );
  }

  const amenities = [
    { icon: <FaBed />, name: 'King Size Bed' },
    { icon: <FaUsers />, name: `Fits ${room.capacity} Guests` },
    { icon: <FaWifi />, name: 'Free Wi-Fi' },
    { icon: <FaTv />, name: 'Smart TV' },
    { icon: <FaSnowflake />, name: 'Air Conditioning' },
    { icon: <FaParking />, name: 'Free Parking' },
  ];

  return (
    <div className="room-details-container">
      <div className="room-details-content">
        <div className="room-details-card">
          <div className="room-details-header">
            <img
              ref={headerRef}
              src={room.image ? `http://127.0.0.1:8000${room.image}` : '/images/default-room.jpg'}
              onError={(e) => {
                e.target.src = '/images/default-room.jpg';
              }}
              alt={room.name}
              className="room-details-image"
            />
            <div className="header-overlay">
              <h1 className="room-details-title">{room.name}</h1>
              <div className="room-details-price">
                <span className="price-amount">${room.price}</span>
                <span>per night</span>
              </div>
            </div>
          </div>

          <div className="room-details-body">
            <div className="details-section">
              <h2 className="section-title">Description</h2>
              <p className="room-description">{room.description}</p>
            </div>

            <div className="details-section">
              <h2 className="section-title">Amenities</h2>
              <div ref={amenitiesRef} className="amenities-grid">
                {amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-text">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-section">
              <h2 className="section-title">Book Now</h2>
              {availabilityError && (
                <div className="error-message">
                  {availabilityError}
                </div>
              )}
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="date-range-section">
                  <h3 className="section-subtitle">
                    <FaCalendarAlt /> Select Dates
                  </h3>
                  <DatePicker
                    selectedRange={dateRange}
                    onSelect={setDateRange}
                    blockedDates={blockedDates}
                    minNights={1}
                    maxNights={30}
                  />
                </div>
                <div className="guest-section">
                  <h3 className="section-subtitle">
                    <FaUsers /> Number of Guests
                  </h3>
                  <div className="guest-selector">
                    <button
                      type="button"
                      onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                      disabled={guests <= 1}
                      className="guest-button"
                    >
                      -
                    </button>
                    <span className="guest-count">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(prev => Math.min(room.capacity, prev + 1))}
                      disabled={guests >= room.capacity}
                      className="guest-button"
                    >
                      +
                    </button>
                  </div>
                  <p className="max-guests">Maximum {room.capacity} guests</p>
                </div>

                {dateRange.from && dateRange.to && (
                  <div className="price-summary">
                    <h3 className="section-subtitle">
                      <FaClock /> Stay Duration
                    </h3>
                    <p className="duration">
                      {Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))} nights
                    </p>
                    <div className="total-price">
                      <span>Total Price:</span>
                      <span className="price">${totalPrice}</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className={`book-now-button ${!isAvailable || availabilityLoading ? 'disabled' : ''}`}
                  disabled={!isAvailable || availabilityLoading || !dateRange.from || !dateRange.to}
                >
                  <span>Book Now</span>
                  <FaArrowRight />
                </button>
              </form>

              <span
                className={`availability-label ${room.is_available ? 'available' : 'unavailable'}`}
              >
                {room.is_available ? 'Available' : 'Currently Unavailable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
