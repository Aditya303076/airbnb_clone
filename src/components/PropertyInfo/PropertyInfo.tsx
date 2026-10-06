import React, { useState } from 'react';
import { Laptop, Key, CalendarCheck, Sparkles, ChevronRight, Bed } from 'lucide-react';
import type { Property } from '../../types/property';
import { DescriptionModal } from '../Modals/DescriptionModal';
import './PropertyInfo.css';

interface PropertyInfoProps {
  property: Property;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);

  return (
    <div className="property-info-section">
      {/* Title & Subtitle Info */}
      <div className="property-main-header">
        <h2 className="section-subtitle">
          Entire apartment in Calangute, India
        </h2>
        <p className="capacity-subtext">
          {property.guestsMax} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.baths} bathrooms
        </p>
        <span className="weekly-discount-chip">Weekly discount</span>
      </div>

      {/* Guest Favourite Wreath Badge Card (Matching Screenshot 3) */}
      <div className="guest-favourite-badge-card">
        <div className="favourite-left-block">
          <span className="laurel-leaf">🌿</span>
          <div className="favourite-titles">
            <span className="favourite-main-title">Guest favourite</span>
            <span className="favourite-sub-title">One of the most loved homes on Airbnb, according to guests</span>
          </div>
          <span className="laurel-leaf">🌿</span>
        </div>
        <div className="favourite-divider" />
        <div className="favourite-rating-block">
          <span className="favourite-score-num">5.0</span>
          <span className="favourite-stars">★★★★★</span>
        </div>
        <div className="favourite-divider" />
        <div className="favourite-reviews-block">
          <span className="favourite-review-num">{property.reviewCount}</span>
          <span className="favourite-review-label">Reviews</span>
        </div>
      </div>

      <div className="divider" />

      {/* Host Row */}
      <div className="host-summary-header">
        <img 
          src={property.host.avatar} 
          alt={property.host.name} 
          className="host-avatar-lg"
        />
        <div className="host-summary-text">
          <h3 className="host-name-title">
            Hosted by {property.host.name}
          </h3>
          <p className="host-badge-sub">
            Superhost · 6 years hosting
          </p>
        </div>
      </div>

      <div className="divider" />

      {/* Highlights List */}
      <div className="highlights-list">
        <div className="highlight-item">
          <div className="highlight-icon">🏆</div>
          <div className="highlight-text">
            <h3 className="highlight-title">Top 5% of homes</h3>
            <p className="highlight-subtitle">This home is highly rated based on reviews, ratings, and reliability.</p>
          </div>
        </div>
        {property.highlights.map((hl) => (
          <div key={hl.id} className="highlight-item">
            <div className="highlight-icon">
              {hl.iconName === 'sparkles' && <Sparkles size={24} color="#222222" />}
              {hl.iconName === 'workspace' && <Laptop size={24} color="#222222" />}
              {hl.iconName === 'checkin' && <Key size={24} color="#222222" />}
              {hl.iconName === 'cancellation' && <CalendarCheck size={24} color="#222222" />}
            </div>
            <div className="highlight-text">
              <h3 className="highlight-title">{hl.title}</h3>
              <p className="highlight-subtitle">{hl.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Property Description */}
      <div className="description-container">
        <p className="description-excerpt">
          {property.description.slice(0, 320)}...
        </p>
        <button 
          className="show-more-btn"
          onClick={() => setIsDescModalOpen(true)}
        >
          <span>Show more</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="divider" />

      {/* Where You'll Sleep */}
      <div className="sleeping-section">
        <h2 className="section-heading">Where you'll sleep</h2>
        <div className="sleeping-cards-grid">
          {property.sleepingArrangements.map((room, idx) => (
            <div key={idx} className="sleeping-card">
              <Bed size={24} color="#222222" />
              <h3 className="room-title">{room.roomName}</h3>
              <p className="room-bed-desc">{room.bedDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description Modal */}
      <DescriptionModal 
        isOpen={isDescModalOpen}
        onClose={() => setIsDescModalOpen(false)}
        description={property.description}
        title={property.title}
      />
    </div>
  );
};
