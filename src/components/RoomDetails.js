import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaBed,
  FaUsers,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaParking,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import DatePicker from './DatePicker';
import useAvailability from '../hooks/useAvailability';
import { useToast } from './ToastManager';
import './RoomDetails.css';

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);
  const showToast = useToast();
  
  const {
    isAvailable,
    isLoading: availabilityLoading,
    totalPrice,
    blockedDates,
    error: availabilityError,
  } = useAvailability(id, selectedRange);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/rooms/${id}/`);
        const data = await response.json();
        
        if (response.ok) {
          setRoom(data);
        } else {
          showToast('Failed to load room details', 'error');
        }
      } catch (error) {
        showToast('Network error. Please try again.', 'error');
      }
    };

    fetchRoom();
  }, [id, showToast]);

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
  };

  const handleBooking = async () => {
    if (!selectedRange) {
      showToast('Please select check-in and check-out dates', 'error');
      return;
    }

    if (!isAvailable) {
      showToast('Room is not available for selected dates', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast('Please login to book a room', 'error');
        return;
      }

      const response = await fetch('http://localhost:8000/api/bookings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room: id,
          check_in: selectedRange.from,
          check_out: selectedRange.to,
          total_price: totalPrice,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Booking successful!', 'success');
        setSelectedRange(null);
      } else {
        showToast(data.error || 'Failed to create booking', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  if (!room) {
    return <div className="loading">Loading...</div>;
  }

  const amenityIcons = {
    wifi: FaWifi,
    tv: FaTv,
    ac: FaSnowflake,
    parking: FaParking,
  };

  return (
    <div className="room-details">
      <div className="room-header">
        <h2>{room.name}</h2>
        <div className="room-type">{room.room_type}</div>
      </div>

      <div className="room-content">
        <div className="room-image">
          <img 
            src={room.image ? `http://127.0.0.1:8000${room.image}` : '/images/default-room.jpg'}
            alt={room.name}
          />
        </div>

        <div className="room-info">
          <div className="room-features">
            <div className="feature">
              <FaBed />
              <span>{room.num_beds} {room.num_beds > 1 ? 'Beds' : 'Bed'}</span>
            </div>
            <div className="feature">
              <FaUsers />
              <span>Max {room.capacity} Guests</span>
            </div>
          </div>

          <div className="room-amenities">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {room.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity.code];
                return Icon ? (
                  <div key={amenity.id} className="amenity">
                    <Icon />
                    <span>{amenity.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="room-description">
            <h3>Description</h3>
            <p>{room.description}</p>
          </div>

          <div className="room-price">
            <h3>Price per Night</h3>
            <p className="price">₹{room.price}</p>
          </div>
        </div>

        <div className="booking-section">
          <h3>
            <FaCalendarAlt className="calendar-icon" />
            Check Availability
          </h3>
          
          <DatePicker
            selectedRange={selectedRange}
            onSelect={handleRangeSelect}
            blockedDates={blockedDates}
          />

          {selectedRange && (
            <div className="booking-summary">
              <div className="dates">
                <div>
                  <strong>Check-in:</strong> {selectedRange.from.toLocaleDateString()}
                </div>
                <div>
                  <strong>Check-out:</strong> {selectedRange.to.toLocaleDateString()}
                </div>
                <div>
                  <FaClock />
                  <span>{Math.ceil((selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24))} nights</span>
                </div>
              </div>

              {availabilityLoading ? (
                <div>Checking availability...</div>
              ) : availabilityError ? (
                <div className="error-message">{availabilityError}</div>
              ) : (
                <>
                  <div className="total-price">
                    <strong>Total Price:</strong> ₹{totalPrice}
                  </div>
                  <button
                    className={`book-button ${!isAvailable ? 'disabled' : ''}`}
                    onClick={handleBooking}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? (
                      <>
                        Book Now <FaArrowRight />
                      </>
                    ) : (
                      'Not Available'
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
