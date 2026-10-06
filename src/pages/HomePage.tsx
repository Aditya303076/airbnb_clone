import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Header } from '../components/Header/Header';
import { CategoryBar } from '../components/CategoryBar/CategoryBar';
import { Footer } from '../components/Footer/Footer';
import { SearchResultsView } from '../components/Search/SearchResultsView';
import { LoginModal } from '../components/Modals/LoginModal';
import { ApiClient } from '../services/apiClient';
import type { Property } from '../types/property';
import './HomePage.css';

interface ListingCard {
  id: string;
  title: string;
  location: string;
  priceNum: string;
  priceUnit: string;
  rating: number;
  imageUrl: string;
  isGuestFavourite?: boolean;
}

interface RawPropertyItem {
  id: string;
  title: string;
  location: { city: string; country: string };
  price: { currencySymbol: string; amount: number; period: string };
  rating: number;
  photos: Array<{ url: string }>;
  isGuestFavourite?: boolean;
}

const DEFAULT_LISTINGS: ListingCard[] = [
  {
    id: 'villa-glasshouse-kasauli-01',
    title: 'Flat in Calangute',
    location: 'Calangute, Goa',
    priceNum: '₹2,255',
    priceUnit: 'for 1 night',
    rating: 4.98,
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80',
    isGuestFavourite: true
  },
  {
    id: 'apartment-calangute-02',
    title: 'Apartment in Calangute',
    location: 'Calangute, Goa',
    priceNum: '₹6,699',
    priceUnit: 'for 1 night',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    isGuestFavourite: true
  },
  {
    id: 'flat-calangute-03',
    title: 'Flat in Calangute',
    location: 'Calangute, Goa',
    priceNum: '₹4,850',
    priceUnit: 'for 1 night',
    rating: 4.97,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    isGuestFavourite: true
  },
  {
    id: 'apartment-candolim-04',
    title: 'Apartment in Candolim',
    location: 'Candolim, Goa',
    priceNum: '₹2,880',
    priceUnit: 'for 1 night',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    isGuestFavourite: true
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const destinationQuery = searchParams.get('destination') || '';
  const categoryQuery = searchParams.get('category') || '';
  const guestsQuery = searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined;

  const [goaListings, setGoaListings] = useState<ListingCard[]>(DEFAULT_LISTINGS);
  const [fullProperties, setFullProperties] = useState<Property[]>([]);

  useEffect(() => {
    let isMounted = true;
    ApiClient.getProperties({
      destination: destinationQuery || undefined,
      category: categoryQuery || undefined,
      guests: guestsQuery
    }).then(res => {
      if (isMounted && res && res.success && Array.isArray(res.data)) {
        setFullProperties(res.data);
        if (res.data.length > 0) {
          const mapped: ListingCard[] = res.data.map((item: RawPropertyItem) => ({
            id: item.id,
            title: item.title,
            location: `${item.location.city}, ${item.location.country}`,
            priceNum: `${item.price.currencySymbol}${item.price.amount.toLocaleString()}`,
            priceUnit: `for 1 ${item.price.period}`,
            rating: item.rating,
            imageUrl: item.photos[0]?.url || DEFAULT_LISTINGS[0].imageUrl,
            isGuestFavourite: item.isGuestFavourite
          }));
          setGoaListings(mapped);
        } else if (destinationQuery || categoryQuery || guestsQuery) {
          ApiClient.getProperties({}).then(allRes => {
            if (isMounted && allRes && allRes.success && Array.isArray(allRes.data)) {
              setFullProperties(allRes.data);
            }
          });
          setGoaListings([]);
        } else {
          setGoaListings(DEFAULT_LISTINGS);
        }
      }
    });
    return () => { isMounted = false; };
  }, [destinationQuery, categoryQuery, guestsQuery]);

  const handleCategorySelect = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (!categoryName) {
      params.delete('category');
    } else {
      params.set('category', categoryName);
    }
    navigate(`/?${params.toString()}`);
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

  const handleScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 10);
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  if (destinationQuery || categoryQuery || guestsQuery) {
    return (
      <div className="home-page" style={{ height: '100vh', overflow: 'hidden' }}>
        <Header isCompactOnly={true} />
        <SearchResultsView 
          listings={fullProperties}
          destinationQuery={destinationQuery}
          categoryQuery={categoryQuery}
        />
      </div>
    );
  }

  const sectionTitle = categoryQuery
    ? `Stays in "${categoryQuery}"`
    : destinationQuery
    ? `Stays in "${destinationQuery}"`
    : 'Guest favourite homes in North Goa';

  const sectionSubtitle = categoryQuery
    ? `Showing top rated ${categoryQuery.toLowerCase()} stays`
    : destinationQuery
    ? `Showing dynamic results for "${destinationQuery}"`
    : 'Indian guests often rate these homes highly';

  return (
    <div className="home-page">
      <Header showAllTab={true} />
      <CategoryBar 
        activeCategory={categoryQuery}
        onSelectCategory={handleCategorySelect}
      />

      <main className="page-container home-main-container">
        {/* Section 1: Dynamic Listings Section */}
        <section className="home-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-main-heading">
                <Link to="/" className="heading-link">
                  {sectionTitle}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" className="heading-arrow-svg">
                    <g fill="none"><path d="M28 16H2M17 4l11.3 11.3a1 1 0 0 1 0 1.4L17 28"></path></g>
                  </svg>
                </Link>
              </h2>
              <p className="section-sub-heading">{sectionSubtitle}</p>
            </div>

            <div className="carousel-nav-buttons">
              <button 
                className="carousel-btn prev-btn" 
                onClick={scrollPrev} 
                disabled={!canScrollLeft}
                aria-label="Previous items"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button 
                className="carousel-btn next-btn" 
                onClick={scrollNext}
                aria-label="Next items"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {goaListings.length === 0 ? (
            <div className="no-results-card">
              <div className="no-results-icon-wrapper">
                <MapPin size={28} />
              </div>
              <h2 className="no-results-title">
                No stays available in "{categoryQuery || destinationQuery}"
              </h2>
              <p className="no-results-subtitle">
                We don't have active host listings for this selection right now. Explore popular destinations listed by hosts below:
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
                Clear filters & view all stays
              </button>
            </div>
          ) : (
            <div 
              className="goa-listings-scroll" 
              ref={scrollRef}
              onScroll={handleScroll}
            >
              {goaListings.map((listing) => (
                <div 
                  key={listing.id}
                  className="goa-card-item"
                  onClick={() => navigate(`/rooms/${listing.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/rooms/${listing.id}`)}
                >
                  <div className="card-img-wrapper">
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.title} 
                      loading="lazy" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    
                    {listing.isGuestFavourite && (
                      <span className="guest-favourite-chip">Guest favourite</span>
                    )}

                    <button 
                      className={`card-heart-btn ${savedIds.includes(listing.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSave(e, listing.id)}
                      aria-label={`Add to wishlist: ${listing.title}`}
                    >
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" className="heart-svg">
                        <path 
                          d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"
                          fill={savedIds.includes(listing.id) ? '#FF385C' : 'rgba(0, 0, 0, 0.5)'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="card-info-block">
                    <h3 className="card-location-title">{listing.title}</h3>
                    <div className="card-price-rating-row">
                      <span className="price-bold">{listing.priceNum}</span>
                      <span className="price-unit">{listing.priceUnit}</span>
                      <span className="meta-dot">·</span>
                      <span className="rating-star">★</span>
                      <span className="rating-num">{listing.rating.toFixed(listing.rating % 1 === 0 ? 1 : 2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Explore Experiences Nearby */}
        <section className="home-section margin-top-lg">
          <div className="section-title-row">
            <div>
              <h2 className="section-main-heading">
                <Link to="/" className="heading-link">
                  Explore experiences nearby
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" className="heading-arrow-svg">
                    <g fill="none"><path d="M28 16H2M17 4l11.3 11.3a1 1 0 0 1 0 1.4L17 28"></path></g>
                  </svg>
                </Link>
              </h2>
            </div>
          </div>

          <div className="experiences-grid">
            <div className="exp-card" onClick={() => navigate('/rooms/apartment-calangute-02')}>
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" alt="Scuba Diving" />
              <div className="exp-info">
                <h3>Scuba Diving & Watersports</h3>
                <p>Grande Island, Goa</p>
              </div>
            </div>
            <div className="exp-card" onClick={() => navigate('/rooms/flat-calangute-03')}>
              <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80" alt="Sunset Cruise" />
              <div className="exp-info">
                <h3>Mandovi River Sunset Cruise</h3>
                <p>Panaji, Goa</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
