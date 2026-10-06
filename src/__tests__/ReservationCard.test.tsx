import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ReservationCard } from '../components/ReservationCard/ReservationCard';
import { mockProperty } from '../data/propertyData';

describe('ReservationCard Component', () => {
  const checkIn = new Date(2026, 9, 12);
  const checkOut = new Date(2026, 9, 17); // 5 nights

  it('renders per night price and calculates total accurately', () => {
    render(
      <MemoryRouter>
        <ReservationCard 
          property={mockProperty} 
          checkInDate={checkIn} 
          checkOutDate={checkOut} 
          onSelectDatesClick={vi.fn()} 
        />
      </MemoryRouter>
    );

    // Per night check: ₹18,500
    expect(screen.getByText('₹18,500')).toBeInTheDocument();
    
    // 5 nights base calculation: 18500 * 5 = 92,500
    expect(screen.getByText('₹18,500 × 5 nights')).toBeInTheDocument();
    expect(screen.getByText('₹92,500')).toBeInTheDocument();

    // Total calculation: 92500 + 2500 + 3200 = 98,200
    expect(screen.getByText('₹98,200')).toBeInTheDocument();
  });

  it('toggles guest dropdown when guests button is clicked', () => {
    render(
      <MemoryRouter>
        <ReservationCard 
          property={mockProperty} 
          checkInDate={checkIn} 
          checkOutDate={checkOut} 
          onSelectDatesClick={vi.fn()} 
        />
      </MemoryRouter>
    );

    const guestBtn = screen.getByLabelText('Guests selector');
    fireEvent.click(guestBtn);
    expect(screen.getByText('Age 13+')).toBeInTheDocument();
    expect(screen.getByText('Service animals welcome')).toBeInTheDocument();
  });

  it('prompts log in or sign up when user clicks reserve without login session', () => {
    localStorage.removeItem('airbnb_user');
    render(
      <MemoryRouter>
        <ReservationCard 
          property={mockProperty} 
          checkInDate={checkIn} 
          checkOutDate={checkOut} 
          onSelectDatesClick={vi.fn()} 
        />
      </MemoryRouter>
    );

    const reserveBtn = screen.getByRole('button', { name: /reserve/i });
    fireEvent.click(reserveBtn);

    expect(screen.getByText('Log in or sign up')).toBeInTheDocument();
  });

  it('opens reserve request modal directly when user is already logged in', () => {
    localStorage.setItem('airbnb_user', JSON.stringify({ id: 'u1', name: 'Test User', email: 'test@example.com' }));
    render(
      <MemoryRouter>
        <ReservationCard 
          property={mockProperty} 
          checkInDate={checkIn} 
          checkOutDate={checkOut} 
          onSelectDatesClick={vi.fn()} 
        />
      </MemoryRouter>
    );

    const reserveBtn = screen.getByRole('button', { name: /reserve/i });
    fireEvent.click(reserveBtn);

    expect(screen.getByText('Request to book')).toBeInTheDocument();
    localStorage.removeItem('airbnb_user');
  });
});
