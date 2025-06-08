import React from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import 'react-day-picker/dist/style.css';
import './DatePicker.css';

function DatePicker({
  selectedRange,
  onSelect,
  blockedDates = [],
  minNights = 1,
  maxNights = 30
}) {
  const today = new Date();
  
  const disabledDays = [
    { before: today },
    ...blockedDates.map(date => new Date(date))
  ];

  const isDateInRange = (date, from, to) => {
    return (!from || !to) ? false : (
      isAfter(date, from) && isBefore(date, to)
    );
  };

  const isDateBlocked = (date) => {
    return blockedDates.some(blockedDate => 
      format(new Date(blockedDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleSelect = (range) => {
    if (!range) return;

    const { from, to } = range;
    if (!from) return;

    // If only start date is selected
    if (from && !to) {
      // Calculate valid range for end date selection
      const minDate = addDays(from, minNights);
      const maxDate = addDays(from, maxNights);
      
      // Check if there are any blocked dates in the minimum stay range
      const hasBlockedDatesInMinRange = [...Array(minNights)].some((_, i) => {
        const date = addDays(from, i + 1);
        return isDateBlocked(date);
      });

      if (hasBlockedDatesInMinRange) {
        onSelect({ from: null, to: null });
        return;
      }

      onSelect({ from, to: null });
      return;
    }

    // If both dates are selected
    if (from && to) {
      // Check if any dates in range are blocked
      let currentDate = from;
      while (currentDate <= to) {
        if (isDateBlocked(currentDate)) {
          onSelect({ from: null, to: null });
          return;
        }
        currentDate = addDays(currentDate, 1);
      }

      // Check minimum and maximum nights
      const nights = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
      if (nights < minNights || nights > maxNights) {
        onSelect({ from: null, to: null });
        return;
      }

      onSelect({ from, to });
    }
  };

  return (
    <div className="date-picker-container">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={handleSelect}
        disabled={disabledDays}
        modifiers={{
          highlighted: date => selectedRange && isDateInRange(date, selectedRange.from, selectedRange.to)
        }}
        modifiersStyles={{
          disabled: { textDecoration: 'line-through', color: '#ccc' },
          highlighted: { backgroundColor: '#e6f3ff' }
        }}
        footer={
          <div className="date-picker-footer">
            {selectedRange?.from && (
              <p>
                {selectedRange.to ? (
                  <>
                    Selected from {format(selectedRange.from, 'PPP')}
                    {' to '}{format(selectedRange.to, 'PPP')}
                  </>
                ) : (
                  `Select end date`
                )}
              </p>
            )}
            <p className="date-picker-info">
              {`Minimum stay: ${minNights} ${minNights === 1 ? 'night' : 'nights'}`}
            </p>
          </div>
        }
      />
    </div>
  );
}

export default DatePicker;
