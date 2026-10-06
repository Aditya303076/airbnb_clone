import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, CreditCard } from 'lucide-react';
import type { Property } from '../../types/property';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { ApiClient } from '../../services/apiClient';
import { saveLocalReservation } from '../../services/reservationStore';
import './ReserveModal.css';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  checkInDate: Date;
  checkOutDate: Date;
  totalBeforeTaxes: number;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({
  isOpen,
  onClose,
  property,
  checkInDate,
  checkOutDate,
  totalBeforeTaxes
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useModalFocus(isOpen);

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleBookingConfirm = async () => {
    const userStr = localStorage.getItem('airbnb_user');
    if (!userStr) {
      onClose();
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      return;
    }

    const user = JSON.parse(userStr);
    setIsSubmitting(true);
    try {
      saveLocalReservation({
        propertyId: property.id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        status: 'CONFIRMED'
      });

      await ApiClient.createReservation({
        propertyId: property.id,
        userId: user.id || 'usr-guest-001',
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: { adults: 2, children: 0, infants: 0, pets: 0 },
        totalPrice: totalBeforeTaxes
      });

      onClose();
      navigate('/trips');
    } catch {
      saveLocalReservation({
        propertyId: property.id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        status: 'CONFIRMED'
      });
      onClose();
      navigate('/trips');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="presentation">
      <div 
        className="modal-content reserve-modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserve-modal-title"
      >
        <div className="modal-header">
          <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
          <h2 id="reserve-modal-title" className="modal-title">Request to book</h2>
        </div>

        <div className="modal-body reserve-modal-body">
          <div className="reserve-details-row">
            <img src={property.photos[0].url} alt={property.title} className="reserve-thumb-img" />
            <div>
              <span className="reserve-type">{property.type}</span>
              <h3 className="reserve-prop-title">{property.title}</h3>
              <span className="reserve-rating">★ {property.rating.toFixed(2)} ({property.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="divider" />

          <h3 className="section-heading-sm">Your trip</h3>
          <div className="trip-info-block">
            <div className="trip-row">
              <span className="trip-label">Dates</span>
              <span className="trip-val">{formatDate(checkInDate)} – {formatDate(checkOutDate)}</span>
            </div>
            <div className="trip-row">
              <span className="trip-label">Guests</span>
              <span className="trip-val">2 guests</span>
            </div>
          </div>

          <div className="divider" />

          <h3 className="section-heading-sm">Price details</h3>
          <div className="price-summary-box">
            <div className="price-row">
              <span>Total before taxes</span>
              <span className="bold-price">{property.price.currencySymbol}{totalBeforeTaxes.toLocaleString()}</span>
            </div>
          </div>

          <div className="aircover-protection-box">
            <ShieldCheck size={24} color="#FF385C" />
            <p className="aircover-text">
              <strong>Your booking is protected by AirCover.</strong> Includes free cancellation protection and host listing guarantee.
            </p>
          </div>

          <button 
            className="confirm-book-btn"
            onClick={handleBookingConfirm}
            disabled={isSubmitting}
          >
            <CreditCard size={18} />
            <span>{isSubmitting ? 'Processing Booking...' : 'Confirm and Request Booking'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
