import React, { useState } from 'react';
import { 
  Wifi, Mountain, Flame, Laptop, Car, Tv, Bath, Coffee, 
  Utensils, Shield, AlertCircle, Snowflake, WashingMachine,
  Sparkles, Check, X
} from 'lucide-react';
import type { Amenity } from '../../types/property';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import './Amenities.css';

interface AmenitiesProps {
  amenities: Amenity[];
}

export const Amenities: React.FC<AmenitiesProps> = ({ amenities }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useModalFocus(isModalOpen);

  useKeyboardNavigation({
    enabled: isModalOpen,
    onEscape: () => setIsModalOpen(false)
  });

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'mountain': return <Mountain size={24} color="#222222" />;
      case 'wifi': return <Wifi size={24} color="#222222" />;
      case 'hot-tub': return <Sparkles size={24} color="#222222" />;
      case 'flame': return <Flame size={24} color="#222222" />;
      case 'laptop': return <Laptop size={24} color="#222222" />;
      case 'car': return <Car size={24} color="#222222" />;
      case 'tv': return <Tv size={24} color="#222222" />;
      case 'bath': return <Bath size={24} color="#222222" />;
      case 'coffee': return <Coffee size={24} color="#222222" />;
      case 'utensils': return <Utensils size={24} color="#222222" />;
      case 'snowflake': return <Snowflake size={24} color="#222222" />;
      case 'washing-machine': return <WashingMachine size={24} color="#222222" />;
      case 'shield': return <Shield size={24} color="#222222" />;
      case 'alert-circle': return <AlertCircle size={24} color="#222222" />;
      default: return <Sparkles size={24} color="#222222" />;
    }
  };

  const topAmenities = amenities.slice(0, 10);

  // Group all amenities by category for modal
  const categories = Array.from(new Set(amenities.map(a => a.category)));

  return (
    <div className="amenities-section" id="amenities">
      <h2 className="section-heading">What this place offers</h2>

      <div className="amenities-grid">
        {topAmenities.map((amenity) => (
          <div key={amenity.id} className="amenity-item">
            {getAmenityIcon(amenity.iconName)}
            <span className="amenity-name">{amenity.name}</span>
          </div>
        ))}
      </div>

      <button 
        className="show-all-amenities-btn"
        onClick={() => setIsModalOpen(true)}
      >
        Show all 36 amenities
      </button>

      {/* All Amenities Modal Dialog */}
      {isModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsModalOpen(false)} role="presentation">
          <div 
            className="modal-content amenities-modal-content animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="amenities-modal-title"
          >
            <div className="modal-header">
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)} aria-label="Close amenities dialog">
                <X size={18} />
              </button>
              <h2 id="amenities-modal-title" className="modal-title">What this place offers</h2>
            </div>

            <div className="modal-body amenities-modal-body">
              {categories.map((cat) => (
                <div key={cat} className="amenity-category-block">
                  <h3 className="category-title">{cat}</h3>
                  <div className="category-amenities-list">
                    {amenities
                      .filter(a => a.category === cat)
                      .map(a => (
                        <div key={a.id} className="modal-amenity-row">
                          <div className="modal-amenity-left">
                            {getAmenityIcon(a.iconName)}
                            <span className="modal-amenity-name">{a.name}</span>
                          </div>
                          <Check size={18} color="#222222" />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
