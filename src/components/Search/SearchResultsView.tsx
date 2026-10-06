import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Maximize2, Plus, Minus, Tag, MapPin, SearchX } from 'lucide-react';
import type { Property } from '../../types/property';
import { LoginModal } from '../Modals/LoginModal';
import './SearchResultsView.css';

interface SearchResultsViewProps {
  listings: Property[];
  destinationQuery?: string;
  categoryQuery?: string;
}

const AMENITY_FILTERS = [
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'parking', name: 'Free parking' },
  { id: 'wifi', name: 'Wifi' },
  { id: 'pets', name: 'Allows pets' },
  { id: 'ac', name: 'Air conditioning' },
  { id: 'washer', name: 'Washing machine' },
  { id: 'hottub', name: 'Hot tub' },
  { id: 'bathrooms', name: '1+ bathrooms' }
];

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  listings,
  destinationQuery = '',
  categoryQuery = ''
}) => {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId) ? prev.filter(id => id !== amenityId) : [...prev, amenityId]
    );
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const userStr = localStorage.getItem('airbnb_user');
    if (!userStr) {
      setIsLoginModalOpen(true);
      return;
    }
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const nextImage = (e: React.MouseEvent, propId: string, max: number) => {
    e.stopPropagation();
    setCardImageIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) + 1) % max
    }));
  };

  const prevImage = (e: React.MouseEvent, propId: string, max: number) => {
    e.stopPropagation();
    setCardImageIndices(prev => ({
      ...prev,
      [propId]: ((prev[propId] || 0) - 1 + max) % max
    }));
  };

  // Filter listings based on active amenity quick pills
  const filteredListings = listings.filter(item => {
    if (selectedAmenities.length === 0) return true;

    return selectedAmenities.every(amenityKey => {
      if (amenityKey === 'kitchen') {
        return item.amenities.some(a => a.name.toLowerCase().includes('kitchen'));
      }
      if (amenityKey === 'parking') {
        return item.amenities.some(a => a.name.toLowerCase().includes('parking'));
      }
      if (amenityKey === 'wifi') {
        return item.amenities.some(a => a.name.toLowerCase().includes('wifi'));
      }
      if (amenityKey === 'pets') {
        return item.amenities.some(a => a.name.toLowerCase().includes('pet'));
      }
      if (amenityKey === 'ac') {
        return item.amenities.some(a => a.name.toLowerCase().includes('air conditioning') || a.name.toLowerCase().includes('ac'));
      }
      if (amenityKey === 'washer') {
        return item.amenities.some(a => a.name.toLowerCase().includes('wash') || a.name.toLowerCase().includes('laundry'));
      }
      if (amenityKey === 'hottub') {
        return item.amenities.some(a => a.name.toLowerCase().includes('tub') || a.name.toLowerCase().includes('pool') || a.name.toLowerCase().includes('jacuzzi'));
      }
      if (amenityKey === 'bathrooms') {
        return item.baths >= 1;
      }
      return true;
    });
  });

  return (
    <div className="search-results-page">
      {/* Amenity Quick-Filter Bar right under Header */}
      <div className="amenity-filter-bar">
        <button className="filter-main-btn" aria-label="Open Filters dialog">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </button>

        {AMENITY_FILTERS.map(af => (
          <button
            key={af.id}
            className={`amenity-pill-btn ${selectedAmenities.includes(af.id) ? 'active' : ''}`}
            onClick={() => toggleAmenity(af.id)}
          >
            {af.name}
          </button>
        ))}
      </div>

      {/* Main Split View: Left Homes Scroll, Right Sticky Map */}
      <div className="search-split-wrapper">
        {/* Left Column: Scrollable Homes List */}
        <div className="homes-scroll-column">
          <div className="homes-results-header">
            <h1 className="homes-count-title">
              {filteredListings.length} {filteredListings.length === 1 ? 'home' : 'homes'}
              {destinationQuery ? ` in ${destinationQuery}` : ''}
              {categoryQuery ? ` · ${categoryQuery}` : ''}
            </h1>

            <div className="prices-included-tag">
              <Tag size={14} color="#D70466" />
              <span>Prices include all fees</span>
            </div>
          </div>

          {filteredListings.length === 0 ? (
            listings.length === 0 ? (
              <div className="no-results-card">
                <div className="no-results-icon-wrapper">
                  <MapPin size={28} />
                </div>
                <h2 className="no-results-title">
                  No stays available in "{destinationQuery || categoryQuery}"
                </h2>
                <p className="no-results-subtitle">
                  We don't have active host listings in {destinationQuery || categoryQuery} right now. Explore popular destinations listed by hosts below:
                </p>

                <div className="popular-destinations-label">Destinations with host stays</div>
                <div className="popular-destinations-grid">
                  <button className="popular-dest-pill" onClick={() => navigate('/?destination=Ahmedabad')}>
                    <span className="popular-dest-name">Ahmedabad, Gujarat</span>
                    <span className="popular-dest-count">Listed by 5+ hosts • 5 stays</span>
                  </button>
                  <button className="popular-dest-pill" onClick={() => navigate('/?destination=Calangute')}>
                    <span className="popular-dest-name">North Goa</span>
                    <span className="popular-dest-count">Listed by 4+ hosts • 4 stays</span>
                  </button>
                  <button className="popular-dest-pill" onClick={() => navigate('/?destination=Mumbai')}>
                    <span className="popular-dest-name">Mumbai, Maharashtra</span>
                    <span className="popular-dest-count">Listed by top host • 1 stay</span>
                  </button>
                  <button className="popular-dest-pill" onClick={() => navigate('/?destination=Kasauli')}>
                    <span className="popular-dest-name">Kasauli, Himachal</span>
                    <span className="popular-dest-count">Listed by top host • 1 stay</span>
                  </button>
                </div>

                <button className="clear-search-btn" onClick={() => navigate('/')}>
                  Clear search & view all stays
                </button>
              </div>
            ) : (
              <div className="no-results-card">
                <div className="no-results-icon-wrapper">
                  <SearchX size={28} />
                </div>
                <h2 className="no-results-title">No exact matches for selected filters</h2>
                <p className="no-results-subtitle">
                  Try clearing or changing some of your amenity filters to view available stays in this area.
                </p>
                <button className="clear-search-btn" onClick={() => setSelectedAmenities([])}>
                  Clear amenity filters
                </button>
              </div>
            )
          ) : (
            <div className="homes-cards-grid">
              {filteredListings.map(item => {
                const photos = item.photos && item.photos.length > 0 ? item.photos : [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Home' }];
                const currentImgIdx = cardImageIndices[item.id] || 0;
                const currentPhoto = photos[currentImgIdx] || photos[0];
                const isSaved = savedIds.includes(item.id);
                const isHighlighted = highlightedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`search-listing-card ${isHighlighted ? 'highlighted-card' : ''}`}
                    onClick={() => navigate(`/rooms/${item.id}`)}
                    onMouseEnter={() => setHighlightedId(item.id)}
                    onMouseLeave={() => setHighlightedId(null)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Image Box */}
                    <div className="search-card-img-box">
                      <img src={currentPhoto.url} alt={item.title} loading="lazy" />

                      {item.isSuperhost && (
                        <span className="search-guest-fav-badge">🏆 Guest favourite</span>
                      )}

                      <button
                        className="search-card-heart-btn"
                        onClick={(e) => toggleSave(e, item.id)}
                        aria-label={`Save ${item.title}`}
                      >
                        <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
                          <path
                            d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"
                            fill={isSaved ? '#FF385C' : 'rgba(0, 0, 0, 0.5)'}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>

                      {photos.length > 1 && (
                        <>
                          <button
                            className="card-nav-chevron prev"
                            onClick={(e) => prevImage(e, item.id, photos.length)}
                            aria-label="Previous image"
                          >
                            <ChevronLeft size={16} color="#222222" />
                          </button>
                          <button
                            className="card-nav-chevron next"
                            onClick={(e) => nextImage(e, item.id, photos.length)}
                            aria-label="Next image"
                          >
                            <ChevronRight size={16} color="#222222" />
                          </button>

                          <div className="card-carousel-dots">
                            {photos.slice(0, 5).map((_, idx) => (
                              <span
                                key={idx}
                                className={`carousel-dot ${idx === currentImgIdx ? 'active' : ''}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="search-card-details">
                      <div className="search-card-title-row">
                        <span className="search-card-title">{item.type} in {item.location.city}</span>
                        <div className="search-card-rating">
                          <span>★</span>
                          <span>{item.rating.toFixed(2)}</span>
                          <span style={{ color: '#717171', fontWeight: 400 }}>({item.reviewCount})</span>
                        </div>
                      </div>

                      <div className="search-card-sub1">{item.title}</div>
                      <div className="search-card-sub2">
                        {item.bedrooms} bedroom{item.bedrooms > 1 ? 's' : ''} · {item.beds} bed{item.beds > 1 ? 's' : ''} · {item.baths} bathroom{item.baths > 1 ? 's' : ''}
                      </div>
                      <div className="search-card-dates">11–16 Oct</div>

                      <div className="search-card-price-row">
                        <span className="search-price-bold">
                          {item.price.currencySymbol}{(item.price.perNight || (item.price as unknown as { amount?: number }).amount || 0).toLocaleString()}
                        </span>
                        <span className="search-price-unit">night</span>
                      </div>

                      <div className="search-cancellation-badge">Free cancellation</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Sticky Interactive Map View */}
        <div className="sticky-map-column">
          {/* Map Grid SVG Canvas */}
          <svg className="map-svg-canvas" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#E5E3DF" />
            {/* Roads & River SVG elements */}
            <path d="M -50 200 Q 200 150 400 350 T 800 400" fill="none" stroke="#C4D7E6" strokeWidth="32" opacity="0.85" />
            <path d="M 0 100 L 800 120 M 0 300 L 800 320 M 200 0 L 220 600 M 500 0 L 520 600" fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.9" />
            <path d="M 50 50 L 750 550 M 100 500 L 700 100" fill="none" stroke="#F5F3ED" strokeWidth="4" opacity="0.8" />
          </svg>

          {/* Interactive Price Pins on Map */}
          {filteredListings.map((item, idx) => {
            // Distribute map pins dynamically
            const topPositions = [25, 45, 30, 65, 55, 35, 75, 40, 60, 20];
            const leftPositions = [35, 55, 75, 40, 25, 60, 50, 20, 70, 80];
            const top = topPositions[idx % topPositions.length];
            const left = leftPositions[idx % leftPositions.length];
            const priceVal = (item.price.perNight || (item.price as unknown as { amount?: number }).amount || 0).toLocaleString();
            const isHighlighted = highlightedId === item.id;

            return (
              <div
                key={`map-${item.id}`}
                className={`map-price-pill ${isHighlighted ? 'active-pill' : ''}`}
                style={{ top: `${top}%`, left: `${left}%` }}
                onMouseEnter={() => setHighlightedId(item.id)}
                onMouseLeave={() => setHighlightedId(null)}
                onClick={() => navigate(`/rooms/${item.id}`)}
              >
                {item.price.currencySymbol}{priceVal}
              </div>
            );
          })}

          {/* Floating Map Controls */}
          <div className="map-controls-box">
            <button className="map-control-btn" aria-label="Expand map">
              <Maximize2 size={16} />
            </button>
            <button className="map-control-btn" aria-label="Zoom in">
              <Plus size={18} />
            </button>
            <button className="map-control-btn" aria-label="Zoom out">
              <Minus size={18} />
            </button>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
