import React, { useState } from 'react';
import { Star, ChevronDown, Minus, Plus } from 'lucide-react';
import type { Property } from '../../types/property';
import { ReserveModal } from '../Modals/ReserveModal';
import { LoginModal } from '../Modals/LoginModal';
import './ReservationCard.css';

interface ReservationCardProps {
  property: Property;
  checkInDate: Date;
  checkOutDate: Date;
  onSelectDatesClick: () => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  property,
  checkInDate,
  checkOutDate,
  onSelectDatesClick,
}) => {
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // Calculate total nights
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalGuests = adults + children;

  // Price computations
  const baseTotal = property.price.perNight * nights;
  const cleaningFee = property.price.cleaningFee;
  const serviceFee = property.price.serviceFee;
  const totalBeforeTaxes = baseTotal + cleaningFee + serviceFee;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleReserveClick = () => {
    const userStr = localStorage.getItem('airbnb_user');
    if (!userStr) {
      setIsLoginModalOpen(true);
    } else {
      setIsReserveModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsReserveModalOpen(true);
  };

  return (
    <aside className="reservation-card-wrapper">
      {/* Rare Find / Prices Include Fees Banner (Matching Screenshot 2 & 5) */}
      <div className="rare-find-banner">
        <span className="rare-find-icon">💎</span>
        <span className="rare-find-text">Rare find! This place is usually booked</span>
      </div>

      <div className="reservation-card">
        {/* Card Header */}
        <div className="card-header">
          <div className="price-header">
            {property.price.originalPerNight && (
              <span className="original-price">
                {property.price.currencySymbol}{property.price.originalPerNight.toLocaleString()}
              </span>
            )}
            <span className="current-price">
              {property.price.currencySymbol}{property.price.perNight.toLocaleString()}
            </span>
            <span className="price-unit">night</span>
          </div>

          <div className="card-rating">
            <Star size={12} fill="#222222" color="#222222" />
            <span className="rating-num">{property.rating.toFixed(2)}</span>
            <span className="rating-dot">·</span>
            <a href="#reviews" className="reviews-link">{property.reviewCount} reviews</a>
          </div>
        </div>

        {/* Booking Inputs Box */}
        <div className="booking-inputs-box">
          {/* Date Selector Row */}
          <button className="input-row date-input-row" onClick={onSelectDatesClick} aria-label="Change check-in and check-out dates">
            <div className="input-col border-right">
              <span className="input-label">CHECK-IN</span>
              <span className="input-value">{formatDate(checkInDate)}</span>
            </div>
            <div className="input-col">
              <span className="input-label">CHECKOUT</span>
              <span className="input-value">{formatDate(checkOutDate)}</span>
            </div>
          </button>

          {/* Guest Selector Button */}
          <div className="input-row guest-input-row">
            <button 
              className="guest-selector-btn"
              onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
              aria-expanded={isGuestDropdownOpen}
              aria-label="Guests selector"
            >
              <div className="input-col">
                <span className="input-label">GUESTS</span>
                <span className="input-value">
                  {totalGuests} guest{totalGuests > 1 ? 's' : ''}
                  {infants > 0 ? `, ${infants} infant${infants > 1 ? 's' : ''}` : ''}
                  {pets > 0 ? `, ${pets} pet${pets > 1 ? 's' : ''}` : ''}
                </span>
              </div>
              <ChevronDown 
                size={18} 
                className={`chevron-icon ${isGuestDropdownOpen ? 'open' : ''}`} 
              />
            </button>

            {/* Guest Dropdown Menu */}
            {isGuestDropdownOpen && (
              <div className="guest-dropdown animate-fade-in">
                {/* Adults */}
                <div className="guest-type-row">
                  <div>
                    <div className="guest-type-title">Adults</div>
                    <div className="guest-type-subtitle">Age 13+</div>
                  </div>
                  <div className="counter-controls">
                    <button 
                      className="counter-btn"
                      disabled={adults <= 1}
                      onClick={() => setAdults(adults - 1)}
                      aria-label="Decrease adults"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-val">{adults}</span>
                    <button 
                      className="counter-btn"
                      disabled={totalGuests >= property.guestsMax}
                      onClick={() => setAdults(adults + 1)}
                      aria-label="Increase adults"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="guest-type-row">
                  <div>
                    <div className="guest-type-title">Children</div>
                    <div className="guest-type-subtitle">Ages 2–12</div>
                  </div>
                  <div className="counter-controls">
                    <button 
                      className="counter-btn"
                      disabled={children <= 0}
                      onClick={() => setChildren(children - 1)}
                      aria-label="Decrease children"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-val">{children}</span>
                    <button 
                      className="counter-btn"
                      disabled={totalGuests >= property.guestsMax}
                      onClick={() => setChildren(children + 1)}
                      aria-label="Increase children"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="guest-type-row">
                  <div>
                    <div className="guest-type-title">Infants</div>
                    <div className="guest-type-subtitle">Under 2</div>
                  </div>
                  <div className="counter-controls">
                    <button 
                      className="counter-btn"
                      disabled={infants <= 0}
                      onClick={() => setInfants(infants - 1)}
                      aria-label="Decrease infants"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-val">{infants}</span>
                    <button 
                      className="counter-btn"
                      onClick={() => setInfants(infants + 1)}
                      aria-label="Increase infants"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="guest-type-row">
                  <div>
                    <div className="guest-type-title">Pets</div>
                    <div className="guest-type-subtitle">Service animals welcome</div>
                  </div>
                  <div className="counter-controls">
                    <button 
                      className="counter-btn"
                      disabled={pets <= 0}
                      onClick={() => setPets(pets - 1)}
                      aria-label="Decrease pets"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="counter-val">{pets}</span>
                    <button 
                      className="counter-btn"
                      onClick={() => setPets(pets + 1)}
                      aria-label="Increase pets"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="guest-dropdown-footer">
                  <p className="guest-limit-text">
                    This place has a maximum of {property.guestsMax} guests, not including infants.
                  </p>
                  <button 
                    className="close-dropdown-btn"
                    onClick={() => setIsGuestDropdownOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reserve Action Button */}
        <button className="reserve-btn" onClick={handleReserveClick}>
          Reserve
        </button>

        <p className="no-charge-note">You won't be charged yet</p>

        {/* Dynamic Price Breakdown */}
        <div className="price-breakdown-list">
          <div className="breakdown-row">
            <span className="breakdown-label">
              {property.price.currencySymbol}{property.price.perNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span className="breakdown-val">
              {property.price.currencySymbol}{baseTotal.toLocaleString()}
            </span>
          </div>

          <div className="breakdown-row">
            <span className="breakdown-label">Cleaning fee</span>
            <span className="breakdown-val">
              {property.price.currencySymbol}{cleaningFee.toLocaleString()}
            </span>
          </div>

          <div className="breakdown-row">
            <span className="breakdown-label">Airbnb service fee</span>
            <span className="breakdown-val">
              {property.price.currencySymbol}{serviceFee.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="card-divider" />

        {/* Total Price Before Taxes */}
        <div className="breakdown-row total-row">
          <span className="total-label">Total before taxes</span>
          <span className="total-val">
            {property.price.currencySymbol}{totalBeforeTaxes.toLocaleString()}
          </span>
        </div>

        {/* Login Modal (Required before reserve) */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Reserve Modal */}
        <ReserveModal 
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          property={property}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          totalBeforeTaxes={totalBeforeTaxes}
        />
      </div>
    </aside>
  );
};
