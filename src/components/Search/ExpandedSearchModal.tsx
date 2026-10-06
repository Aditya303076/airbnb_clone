import React, { useState } from 'react';
import { Search, X, Minus, Plus } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import './ExpandedSearchModal.css';

interface ExpandedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit: (destination: string, guests: number) => void;
}

export const ExpandedSearchModal: React.FC<ExpandedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchSubmit,
}) => {
  const modalRef = useModalFocus(isOpen);
  const [activeTab, setActiveTab] = useState<'where' | 'checkin' | 'checkout' | 'who'>('where');
  const [destination, setDestination] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  const totalGuests = adults + children;

  const handleSearchClick = () => {
    onSearchSubmit(destination || 'Kasauli', totalGuests);
    onClose();
  };

  return (
    <div className="search-modal-backdrop animate-fade-in" onClick={onClose} role="presentation">
      <div 
        className="search-modal-container animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-heading"
      >
        {/* Top Header Tabs */}
        <div className="search-top-header">
          <div className="search-category-tabs">
            <button className="search-tab-btn active">Stays</button>
            <button className="search-tab-btn">Experiences</button>
          </div>
          <button className="search-close-btn" onClick={onClose} aria-label="Close search overlay">
            <X size={18} />
          </button>
        </div>

        {/* Expanded Search Bar Pill */}
        <div className="expanded-search-bar">
          {/* 1. Where */}
          <div 
            className={`search-segment ${activeTab === 'where' ? 'active' : ''}`}
            onClick={() => setActiveTab('where')}
          >
            <span className="segment-label">Where</span>
            <input 
              type="text" 
              className="segment-input"
              placeholder="Search destinations"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="segment-divider" />

          {/* 2. Check in */}
          <div 
            className={`search-segment ${activeTab === 'checkin' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkin')}
          >
            <span className="segment-label">Check in</span>
            <span className="segment-value">Oct 12, 2026</span>
          </div>

          <div className="segment-divider" />

          {/* 3. Check out */}
          <div 
            className={`search-segment ${activeTab === 'checkout' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkout')}
          >
            <span className="segment-label">Check out</span>
            <span className="segment-value">Oct 17, 2026</span>
          </div>

          <div className="segment-divider" />

          {/* 4. Who */}
          <div 
            className={`search-segment ${activeTab === 'who' ? 'active' : ''}`}
            onClick={() => setActiveTab('who')}
          >
            <span className="segment-label">Who</span>
            <span className="segment-value">
              {totalGuests} guest{totalGuests > 1 ? 's' : ''}
            </span>
          </div>

          {/* Search CTA */}
          <button className="expanded-search-submit-btn" onClick={handleSearchClick} aria-label="Perform search">
            <Search size={16} color="#FFFFFF" strokeWidth={3} />
            <span>Search</span>
          </button>
        </div>

        {/* Dropdown Content Area */}
        <div className="search-dropdown-content">
          {activeTab === 'where' && (
            <div className="where-dropdown-panel animate-fade-in">
              {/* Recent Searches */}
              <div className="search-section-block">
                <h3 className="search-section-heading">Recent searches</h3>
                <div className="search-items-list">
                  <div className="search-item-row" onClick={() => setDestination('Navrangpura')}>
                    <div className="search-item-icon-box">📍</div>
                    <div className="search-item-info">
                      <div className="search-item-title">Navrangpura</div>
                      <div className="search-item-sub">11–12 Oct</div>
                    </div>
                  </div>
                  <div className="search-item-row" onClick={() => setDestination('Ahmedabad')}>
                    <div className="search-item-icon-box">📍</div>
                    <div className="search-item-info">
                      <div className="search-item-title">Ahmedabad</div>
                      <div className="search-item-sub">11–12 Oct • Listed by 3+ top hosts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Destinations */}
              <div className="search-section-block margin-top">
                <h3 className="search-section-heading">Suggested destinations</h3>
                <div className="search-items-list">
                  <div className="search-item-row" onClick={() => setDestination('Nearby')}>
                    <div className="search-item-icon-box blue-bg">🧭</div>
                    <div className="search-item-info">
                      <div className="search-item-title">Nearby</div>
                      <div className="search-item-sub">Find what's around you</div>
                    </div>
                  </div>
                  <div className="search-item-row" onClick={() => setDestination('Ahmedabad, Gujarat')}>
                    <div className="search-item-icon-box orange-bg">🏠</div>
                    <div className="search-item-info">
                      <div className="search-item-title">Ahmedabad, Gujarat</div>
                      <div className="search-item-sub">Listed by 3+ top hosts • 5 stays available</div>
                    </div>
                  </div>
                  <div className="search-item-row" onClick={() => setDestination('Mumbai, Maharashtra')}>
                    <div className="search-item-icon-box green-bg">🏙️</div>
                    <div className="search-item-info">
                      <div className="search-item-title">Mumbai, Maharashtra</div>
                      <div className="search-item-sub">Listed by 2+ top hosts • 2 stays available</div>
                    </div>
                  </div>
                  <div className="search-item-row" onClick={() => setDestination('North Goa, Goa')}>
                    <div className="search-item-icon-box orange-bg">🏖️</div>
                    <div className="search-item-info">
                      <div className="search-item-title">North Goa, Goa</div>
                      <div className="search-item-sub">Listed by 4+ top hosts • 4 stays available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'checkin' || activeTab === 'checkout') && (
            <div className="date-dropdown-panel animate-fade-in">
              <h3 className="panel-heading">Select Dates</h3>
              <p className="panel-subtext">October 12, 2026 – October 17, 2026 (5 nights)</p>
            </div>
          )}

          {activeTab === 'who' && (
            <div className="who-dropdown-panel animate-fade-in">
              <div className="guest-type-row">
                <div>
                  <div className="guest-type-title">Adults</div>
                  <div className="guest-type-subtitle">Ages 13 or above</div>
                </div>
                <div className="counter-controls">
                  <button className="counter-btn" disabled={adults <= 1} onClick={() => setAdults(adults - 1)}><Minus size={12} /></button>
                  <span className="counter-val">{adults}</span>
                  <button className="counter-btn" onClick={() => setAdults(adults + 1)}><Plus size={12} /></button>
                </div>
              </div>

              <div className="guest-type-row">
                <div>
                  <div className="guest-type-title">Children</div>
                  <div className="guest-type-subtitle">Ages 2–12</div>
                </div>
                <div className="counter-controls">
                  <button className="counter-btn" disabled={children <= 0} onClick={() => setChildren(children - 1)}><Minus size={12} /></button>
                  <span className="counter-val">{children}</span>
                  <button className="counter-btn" onClick={() => setChildren(children + 1)}><Plus size={12} /></button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
