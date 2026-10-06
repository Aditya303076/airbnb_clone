import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import './ListingSubHeader.css';

interface ListingSubHeaderProps {
  priceText: string;
  rating: number;
  reviewCount: number;
  onReserveClick: () => void;
}

export const ListingSubHeader: React.FC<ListingSubHeaderProps> = ({
  priceText,
  rating,
  reviewCount,
  onReserveClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'amenities' | 'reviews' | 'location'>('photos');

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const visible = window.scrollY > 550;
          setIsVisible(prev => prev !== visible ? visible : prev);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, tab: 'photos' | 'amenities' | 'reviews' | 'location') => {
    setActiveTab(tab);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="listing-sub-header animate-fade-in">
      <div className="page-container sub-header-container">
        {/* Left Sub-Nav Links */}
        <nav className="sub-nav-links">
          <button 
            className={`sub-nav-btn ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => scrollToSection('photos', 'photos')}
          >
            Photos
          </button>
          <button 
            className={`sub-nav-btn ${activeTab === 'amenities' ? 'active' : ''}`}
            onClick={() => scrollToSection('amenities', 'amenities')}
          >
            Amenities
          </button>
          <button 
            className={`sub-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => scrollToSection('reviews', 'reviews')}
          >
            Reviews
          </button>
          <button 
            className={`sub-nav-btn ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => scrollToSection('location', 'location')}
          >
            Location
          </button>
        </nav>

        {/* Right Sticky Price & Reserve CTA */}
        <div className="sub-header-right">
          <div className="sub-header-price-info">
            <span className="sub-price">{priceText}</span>
            <span className="sub-rating">
              <Star size={12} fill="#222222" color="#222222" />
              <span>{rating.toFixed(1)}</span>
              <span className="sub-dot">·</span>
              <span className="sub-reviews">{reviewCount} reviews</span>
            </span>
          </div>

          <button className="sub-reserve-btn" onClick={onReserveClick}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};
