import React, { useState, useEffect } from 'react';

function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://127.0.0.1:8000/api/reservations/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => setReservations(data))
        .catch(error => console.error('Error fetching reservations:', error));
    } else {
      // Handle case where user is not logged in, maybe redirect to login
      console.log('No token found, user not logged in.');
    }
  }, []);

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
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
