import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isAfter, isBefore, addDays } from "date-fns";
import "./DatePicker.css";

function DatePicker({
  selectedRange,
  onSelect,
  blockedDates = [],
  minNights = 1,
  maxNights = 30,
}) {
  const today = new Date();
  const disabledDays = [
    { before: today },
    ...blockedDates.map((date) => new Date(date)),
  ];

  const isDateInRange = (date, from, to) => {
    if (!from || !to) return false;
    return isAfter(date, from) && isBefore(date, to);
  };

  const isDateBlocked = (date) =>
    blockedDates.some((blockedDate) =>
      format(new Date(blockedDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

  const handleSelect = (range) => {
    if (!range?.from) {
      onSelect(undefined);
      return;
    }

    const nights = Math.ceil(
      (range.to - range.from) / (1000 * 60 * 60 * 24)
    );

    if (nights < minNights || nights > maxNights) {
      onSelect(undefined);
      return;
    }

    // Check if any date in range is blocked
    let currentDate = range.from;
    while (currentDate <= range.to) {
      if (isDateBlocked(currentDate)) {
        onSelect(undefined);
        return;
      }
      currentDate = addDays(currentDate, 1);
    }

    onSelect(range);
  };

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={handleSelect}
      disabled={disabledDays}
      modifiers={{
        highlighted: (date) =>
          selectedRange && isDateInRange(date, selectedRange.from, selectedRange.to),
      }}
      modifiersStyles={{
        highlighted: {
          backgroundColor: "#e6f3ff",
        },
      }}
    />
  );
}

export default DatePicker;
