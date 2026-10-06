import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from '../components/Calendar/Calendar';
import { getPersistedDates, persistDates } from '../services/datePersistence';
import { describe, it, expect, vi } from 'vitest';

describe('Calendar Component & Date Persistence', () => {
  it('persists and restores dates correctly from localStorage', () => {
    const checkIn = new Date(2026, 9, 14);
    const checkOut = new Date(2026, 9, 19);
    persistDates(checkIn, checkOut);

    const restored = getPersistedDates();
    expect(restored.checkInDate.toDateString()).toBe(checkIn.toDateString());
    expect(restored.checkOutDate.toDateString()).toBe(checkOut.toDateString());
  });

  it('renders booked dates with dimmed font color and line-through disabled state', () => {
    const checkIn = new Date(2026, 9, 11);
    const checkOut = new Date(2026, 9, 12);
    const bookedRanges = [
      { start: new Date(2026, 9, 15), end: new Date(2026, 9, 18) }
    ];
    const onDatesChange = vi.fn();

    render(
      <Calendar 
        checkInDate={checkIn}
        checkOutDate={checkOut}
        onDatesChange={onDatesChange}
        bookedRanges={bookedRanges}
      />
    );

    // Day 15 is booked
    const bookedDayBtn = screen.getByRole('button', { name: /October 15, 2026 is booked/i });
    expect(bookedDayBtn).toBeDisabled();
    expect(bookedDayBtn).toHaveClass('booked-date');
    expect(bookedDayBtn).toHaveAttribute('aria-disabled', 'true');

    // Click on booked day should not trigger onDatesChange
    fireEvent.click(bookedDayBtn);
    expect(onDatesChange).not.toHaveBeenCalled();
  });
});
