import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBed, FaUsers, FaWifi, FaTv, FaSnowflake, FaParking, FaArrowRight } from 'react-icons/fa';
import './RoomDetails.css';

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem('token');
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

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: id,
          check_in_date: bookingDates.checkIn,
          check_out_date: bookingDates.checkOut,
          guest_count: bookingDates.guests,
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
              src={room.image || '/images/default-room.jpg'}
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
              <div className="amenities-grid">
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
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label className="form-label">Check-in Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingDates.checkIn}
                    onChange={(e) =>
                      setBookingDates((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Check-out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingDates.checkOut}
                    onChange={(e) =>
                      setBookingDates((prev) => ({
                        ...prev,
                        checkOut: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    value={bookingDates.guests}
                    onChange={(e) =>
                      setBookingDates((prev) => ({
                        ...prev,
                        guests: parseInt(e.target.value),
                      }))
                    }
                    min="1"
                    max={room.capacity}
                    required
                  />
                </div>

                <button type="submit" className="book-now-button">
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
