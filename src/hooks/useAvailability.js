import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { useToast } from '../components/ToastManager';

function useAvailability(roomId, dateRange) {
  const { token } = useAuth();
  const showToast = useToast();

  const [state, setState] = useState({
    isAvailable: false,
    isLoading: false,
    totalPrice: 0,
    blockedDates: [],
    error: null,
  });

  useEffect(() => {
    const checkAvailability = async () => {
      if (!dateRange?.from || !dateRange?.to) {
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch(
          `http://localhost:8000/api/rooms/${roomId}/check-availability/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              check_in: dateRange.from.toISOString().split('T')[0],
              check_out: dateRange.to.toISOString().split('T')[0],
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setState({
            isAvailable: data.available,
            isLoading: false,
            totalPrice: data.total_price || 0,
            blockedDates: data.blocked_dates || [],
            error: null,
          });

          if (!data.available) {
            showToast('Selected dates are not available', 'warning');
          }
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: data.error || 'Failed to check availability',
          }));
          showToast(data.error || 'Failed to check availability', 'error');
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Network error. Please try again.',
        }));
        showToast('Network error. Please try again.', 'error');
      }
    };

    if (dateRange?.from && dateRange?.to) {
      checkAvailability();
    }
  }, [roomId, dateRange, token, showToast]);

  return state;
}

export default useAvailability;
