import React, { useState, useEffect } from 'react';
import { persistDates } from '../../services/datePersistence';
import type { BookedDateRange } from '../../services/reservationStore';
import './Calendar.css';

interface CalendarProps {
  checkInDate: Date;
  checkOutDate: Date;
  onDatesChange: (checkIn: Date, checkOut: Date) => void;
  bookedRanges?: BookedDateRange[];
}

export const Calendar: React.FC<CalendarProps> = ({
  checkInDate,
  checkOutDate,
  onDatesChange,
  bookedRanges = []
}) => {
  const [selectedStart, setSelectedStart] = useState<Date>(checkInDate);
  const [selectedEnd, setSelectedEnd] = useState<Date>(checkOutDate);

  useEffect(() => {
    setSelectedStart(checkInDate);
    setSelectedEnd(checkOutDate);
  }, [checkInDate, checkOutDate]);

  const nights = Math.max(1, Math.ceil(Math.abs(selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24)));

  const isDateBooked = (date: Date): boolean => {
    if (!bookedRanges || bookedRanges.length === 0) return false;
    const dTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return bookedRanges.some(range => {
      const sTime = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate()).getTime();
      const eTime = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate()).getTime();
      return dTime >= sTime && dTime <= eTime;
    });
  };

  const handleDateClick = (dayNum: number, monthOffset: number) => {
    const targetDate = new Date(2026, 9 + monthOffset, dayNum);
    if (isDateBooked(targetDate)) return;

    // Standard 5 nights default or next valid range
    const FIVE_NIGHTS_MS = 5 * 24 * 60 * 60 * 1000;
    const candidateEnd = new Date(targetDate.getTime() + FIVE_NIGHTS_MS);

    // If candidate range hits a booked date, cap end date before the booked date
    let validEnd = candidateEnd;
    for (let d = 1; d <= 5; d++) {
      const checkD = new Date(targetDate.getTime() + d * 24 * 60 * 60 * 1000);
      if (isDateBooked(checkD)) {
        validEnd = new Date(targetDate.getTime() + Math.max(1, d - 1) * 24 * 60 * 60 * 1000);
        break;
      }
    }
    const targetEndDate = validEnd;

    setSelectedStart(targetDate);
    setSelectedEnd(targetEndDate);
    persistDates(targetDate, targetEndDate);
    onDatesChange(targetDate, targetEndDate);
  };

  const clearDates = () => {
    const defaultStart = new Date(2026, 9, 11);
    const defaultEnd = new Date(2026, 9, 12);
    setSelectedStart(defaultStart);
    setSelectedEnd(defaultEnd);
    persistDates(defaultStart, defaultEnd);
    onDatesChange(defaultStart, defaultEnd);
  };

  const renderMonthGrid = (monthName: string, monthOffset: number, totalDays: number, startDayOfWeek: number) => {
    const days = [];
    // Padding empty cells
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Month day cells
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(2026, 9 + monthOffset, day);
      const isBooked = isDateBooked(currentDate);
      const isSelectedStart = currentDate.toDateString() === selectedStart?.toDateString();
      const isSelectedEnd = currentDate.toDateString() === selectedEnd?.toDateString();
      const isInRange = selectedStart && selectedEnd && currentDate > selectedStart && currentDate < selectedEnd;

      let cellClass = 'calendar-day';
      if (isBooked) {
        cellClass += ' booked-date';
      } else {
        if (isSelectedStart) cellClass += ' selected-start';
        if (isSelectedEnd) cellClass += ' selected-end';
        if (isInRange) cellClass += ' in-range';
      }

      days.push(
        <button
          key={day}
          className={cellClass}
          onClick={() => !isBooked && handleDateClick(day, monthOffset)}
          disabled={isBooked}
          aria-disabled={isBooked}
          aria-label={isBooked ? `${monthName} ${day}, 2026 is booked` : `Select ${monthName} ${day}, 2026`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="month-block">
        <div className="month-header-title">{monthName} 2026</div>
        <div className="days-header-row">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div className="days-grid">{days}</div>
      </div>
    );
  };

  return (
    <div className="calendar-section" id="calendar">
      <div className="calendar-header-info">
        <div>
          <h2 className="section-heading" style={{ marginBottom: '4px' }}>
            {nights} night{nights > 1 ? 's' : ''} stay
          </h2>
          <p className="calendar-subtext">
            {selectedStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} – {selectedEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="calendar-months-container">
        {renderMonthGrid('October', 0, 31, 4)} {/* Oct 1 2026 is Thursday */}
        {renderMonthGrid('November', 1, 30, 0)} {/* Nov 1 2026 is Sunday */}
      </div>

      <div className="calendar-bottom-bar">
        <button className="keyboard-icon-btn" aria-label="Keyboard shortcuts">
          ⌨️
        </button>
        <button className="clear-dates-btn" onClick={clearDates}>
          Clear dates
        </button>
      </div>
    </div>
  );
};
