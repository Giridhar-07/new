import { useState, useEffect } from 'react';

const useAvailability = (roomId, checkIn, checkOut) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pricing, setPricing] = useState({
    totalPrice: 0,
    pricePerNight: 0,
    cleaningFee: 0,
    nights: 0
  });
  const [blockedDates, setBlockedDates] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!roomId || !checkIn || !checkOut) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/rooms/${roomId}/availability/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            check_in_date: checkIn,
            check_out_date: checkOut
          })
        });

        if (!response.ok) {
          throw new Error('Failed to check availability');
        }

        const data = await response.json();
        setIsAvailable(data.is_available);
      setPricing({
        totalPrice: data.total_price || 0,
        pricePerNight: data.base_price || 0,
        cleaningFee: data.cleaning_fee || 0,
        nights: data.nights || 0
      });
      setRoomDetails(data.room_details || null);
        setBlockedDates(data.blocked_dates || []);
      } catch (err) {
        setError(err.message);
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [roomId, checkIn, checkOut]);

  const formatBlockedDates = () => {
    return blockedDates.map(date => new Date(date));
  };

  return {
    isAvailable,
    isLoading,
    error,
    pricing,
    blockedDates: formatBlockedDates(),
    roomDetails
  };
};

export default useAvailability;
