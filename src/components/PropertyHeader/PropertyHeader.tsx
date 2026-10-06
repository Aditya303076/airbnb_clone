import React, { useState } from 'react';
import { Star, Share, Heart, Award } from 'lucide-react';
import type { Property } from '../../types/property';
import { ShareModal } from '../Modals/ShareModal';
import './PropertyHeader.css';

interface PropertyHeaderProps {
  property: Property;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="property-header-section">
      <h1 className="property-title">{property.title}</h1>

      <div className="property-action-bar">
        {/* Left Stats & Badges */}
        <div className="property-meta-info">
          <span className="meta-item rating-meta">
            <Star size={14} fill="#222222" color="#222222" />
            <span className="rating-score">{property.rating.toFixed(2)}</span>
          </span>
          <span className="meta-dot">·</span>
          <a href="#reviews" className="meta-item underline-link">
            {property.reviewCount} reviews
          </a>
          {property.isSuperhost && (
            <>
              <span className="meta-dot">·</span>
              <span className="meta-item superhost-tag">
                <Award size={14} color="#717171" />
                <span>Superhost</span>
              </span>
            </>
          )}
          <span className="meta-dot">·</span>
          <a href="#location" className="meta-item underline-link location-text">
            {property.location.city}, {property.location.state}, {property.location.country}
          </a>
        </div>

        {/* Right Controls (Share & Save) */}
        <div className="property-header-actions">
          <button 
            className="header-action-btn"
            onClick={() => setIsShareModalOpen(true)}
            aria-label="Share property link"
          >
            <Share size={16} />
            <span>Share</span>
          </button>

          <button 
            className={`header-action-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => setIsSaved(!isSaved)}
            aria-label={isSaved ? 'Saved to wishlist' : 'Save to wishlist'}
          >
            <Heart 
              size={16} 
              fill={isSaved ? '#FF385C' : 'none'} 
              color={isSaved ? '#FF385C' : '#222222'} 
            />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)}
        propertyTitle={property.title}
      />
    </div>
  );
};
