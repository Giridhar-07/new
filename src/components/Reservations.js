import React, { useState, useEffect } from 'react';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [discount, setDiscount] = useState(null);
  const [totalCost, setTotalCost] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://127.0.0.1:8000/api/reservations/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setReservations(data));
  }, []);

  const handleCheckAvailability = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/api/check_availability/?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setAvailability(data.available);
    setError(data.error || '');
    setDiscount(data.discount);
    setTotalCost(data.total_cost);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/reservations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        room: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName,
        email: email
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Refresh the reservations list
      fetch('http://localhost:8000/api/reservations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => setReservations(data));
      // Reset the form
      setRoomId('');
      setCheckIn('');
      setCheckOut('');
      setGuestName('');
      setEmail('');
      setAvailability(null);
      setError('');
    } else {
      // Display an error message
      setError(data.error || 'Failed to submit reservation');
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h2>Reservations</h2>
      <div>
        <label htmlFor="roomId">Room ID:</label>
        <input type="text" id="roomId" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      </div>
      <div>
        <label htmlFor="checkIn">Check-in Date:</label>
        <input type="date" id="checkIn" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      </div>
      <div>
        <label htmlFor="checkOut">Check-out Date:</label>
        <input type="date" id="checkOut" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
      </div>
      <button onClick={handleCheckAvailability}>Check Availability</button>
      {availability !== null && (
        <div>
          {availability ? (
            <p>This room is available for the selected dates.</p>
          ) : (
            <p>This room is not available for the selected dates.</p>
          )}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="guestName">Guest Name:</label>
          <input type="text" id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" disabled={!availability}>Submit Reservation</button>
      </form>
      {discount !== null && (
        <div>
          <p>Discount: {discount}%</p>
          <p>Total Cost: {totalCost}</p>
        </div>
      )}
      {reservations.map(reservation => (
        <div key={reservation.id}>
          <h3>{reservation.room}</h3>
          <p>Check-in: {reservation.check_in}</p>
          <p>Check-out: {reservation.check_out}</p>
        </div>
      ))}
    </main>
  );
}

export default Reservations;
