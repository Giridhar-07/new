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
    // Temporarily hardcode token for testing
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTU4ODc0LCJpYXQiOjE3NDcxNTg1NzQsImp0aSI6IjgzMzI5ZGExYTI1ODQxZWQ5MDBjOTkzN2E5MzU5M2M1IiwidXNlcl9pZCI6M30.OhVvg9b2cv3CazPRIjNmD5UNOMCSy9aZOcGNxYfvlNM');
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
    console.log('Check Availability button clicked');
    if (!roomId || !checkIn || !checkOut) {
      setError('Please fill in Room ID, Check-in Date, and Check-out Date.');
      setAvailability(null);
      setDiscount(null);
      setTotalCost(null);
      console.log('Missing parameters for availability check');
      return;
    }

    setError(''); // Clear previous errors
    const token = localStorage.getItem('token');
    console.log('Checking availability for Room ID:', roomId, 'Check-in:', checkIn, 'Check-out:', checkOut);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/check_availability/?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Availability API response status:', response.status);
      const data = await response.json();
      console.log('Availability API response data:', data);

      setAvailability(data.available);
      setError(data.error || '');
      setDiscount(data.discount);
      setTotalCost(data.total_cost);
      console.log('Availability check result:', data.available);

    } catch (error) {
      console.error('Error during availability check fetch:', error);
      setError('An error occurred during availability check.');
    }
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
        room: parseInt(roomId),
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
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create Reservation</h2>
      
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-gray-700 text-sm font-bold mb-2">Room ID:</label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Room ID"
            />
          </div>
          <div>
            <label htmlFor="checkIn" className="block text-gray-700 text-sm font-bold mb-2">Check-in Date:</label>
            <input
              type="date"
              id="checkIn"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="block text-gray-700 text-sm font-bold mb-2">Check-out Date:</label>
            <input
              type="date"
              id="checkOut"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button onClick={handleCheckAvailability} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Check Availability</button>
          {availability !== null && (
            <div>
              {availability ? (
                <p className="text-green-500">This room is available for the selected dates.</p>
              ) : (
                <p className="text-red-500">This room is not available for the selected dates.</p>
              )}
              {discount !== null && (
                <div>
                  <p>Discount: {discount}%</p>
                  <p>Total Cost: {totalCost}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="guestName" className="block text-gray-700 text-sm font-bold mb-2">Guest Name:</label>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Guest Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Email"
            />
          </div>
          <button
            type="submit"
            disabled={!availability}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            Submit Reservation
          </button>
        </form>

        <h2 className="text-xl font-bold mt-8 text-gray-800 text-center">Existing Reservations</h2>
        {Array.isArray(reservations) && reservations.map(reservation => (
          <div key={reservation.id} className="border rounded p-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-700">{reservation.room.name}</h3>
            <p className="text-gray-600">Check-in: {reservation.check_in}</p>
            <p className="text-gray-600">Check-out: {reservation.check_out}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Reservations;
