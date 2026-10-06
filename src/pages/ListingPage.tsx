import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProperty } from '../data/propertyData';
import type { Property } from '../types/property';
import { ApiClient } from '../services/apiClient';
import { useLightbox } from '../hooks/useLightbox';
import { Header } from '../components/Header/Header';
import { ListingSubHeader } from '../components/ListingSubHeader/ListingSubHeader';
import { PropertyHeader } from '../components/PropertyHeader/PropertyHeader';
import { HeroGallery } from '../components/HeroGallery/HeroGallery';
import { PropertyInfo } from '../components/PropertyInfo/PropertyInfo';
import { Amenities } from '../components/Amenities/Amenities';
import { Calendar } from '../components/Calendar/Calendar';
import { Reviews } from '../components/Reviews/Reviews';
import { HostSection } from '../components/HostSection/HostSection';
import { LocationMap } from '../components/LocationMap/LocationMap';
import { ReservationCard } from '../components/ReservationCard/ReservationCard';
import { PhotoTour } from '../components/PhotoTour/PhotoTour';
import { Lightbox } from '../components/Lightbox/Lightbox';
import { Footer } from '../components/Footer/Footer';
import { getPersistedDates, persistDates } from '../services/datePersistence';
import { fetchBookedDateRanges, type BookedDateRange } from '../services/reservationStore';
import './ListingPage.css';

interface ListingPageProps {
  initialPhotoTourOpen?: boolean;
}

export const ListingPage: React.FC<ListingPageProps> = ({ initialPhotoTourOpen = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property>(mockProperty);

  // Dates state persisted across hard refresh
  const initialDates = getPersistedDates();
  const [checkInDate, setCheckInDate] = useState<Date>(initialDates.checkInDate);
  const [checkOutDate, setCheckOutDate] = useState<Date>(initialDates.checkOutDate);
  const [bookedRanges, setBookedRanges] = useState<BookedDateRange[]>([]);

  useEffect(() => {
    const targetId = id || 'villa-glasshouse-kasauli-01';
    let isMounted = true;
    ApiClient.getPropertyById(targetId).then(res => {
      if (isMounted && res && res.success && res.data) {
        const data = res.data;
        if (data.price && !data.price.perNight) {
          data.price.perNight = data.price.amount;
        }
        setProperty(data);
      }
    });

    fetchBookedDateRanges(targetId).then(ranges => {
      if (isMounted) {
        setBookedRanges(ranges);
      }
    });

    return () => { isMounted = false; };
  }, [id]);

  // Photo Tour & Lightbox hooks
  const [isPhotoTourOpen, setIsPhotoTourOpen] = useState(initialPhotoTourOpen);
  const lightbox = useLightbox(property.photos.length);

  const handleOpenPhotoTour = () => {
    lightbox.closeLightbox();
    setIsPhotoTourOpen(true);
  };

  const handleOpenLightbox = (index: number) => {
    lightbox.openLightbox(index);
  };

  const handleScrollToCalendar = () => {
    const calendarElem = document.getElementById('calendar');
    if (calendarElem) {
      calendarElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="listing-page">
      {/* Top Header (Compact mode for room pages matching Airbnb) */}
      <Header isCompactOnly />

      {/* Sticky Room Sub-Navbar (Matching Screenshot 3) */}
      <ListingSubHeader 
        priceText={`${property.price.currencySymbol}${property.price.perNight.toLocaleString()} for 1 night`}
        rating={property.rating}
        reviewCount={property.reviewCount}
        onReserveClick={handleScrollToCalendar}
      />

      {/* Main Page Container */}
      <main className="page-container">
        {/* Title & Actions Bar */}
        <PropertyHeader property={property} />

        {/* Hero 5-Photo Gallery */}
        <div id="photos">
          <HeroGallery 
            photos={property.photos}
            onOpenPhotoTour={handleOpenPhotoTour}
            onOpenLightbox={handleOpenLightbox}
          />
        </div>

        {/* Main Content Split */}
        <div className="listing-split-content">
          {/* Left Column (63% Width) */}
          <div className="listing-left-col">
            <PropertyInfo property={property} />
            <div className="divider" />

            <div id="amenities">
              <Amenities amenities={property.amenities} />
            </div>
            <div className="divider" />

            <div id="calendar">
              <Calendar 
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                bookedRanges={bookedRanges}
                onDatesChange={(start, end) => {
                  setCheckInDate(start);
                  setCheckOutDate(end);
                  persistDates(start, end);
                }}
              />
            </div>
          </div>

          {/* Right Column (Sticky Reservation Card until Date Selection / Calendar) */}
          <div className="listing-right-col">
            <ReservationCard 
              property={property}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onSelectDatesClick={handleScrollToCalendar}
            />
          </div>
        </div>

        <div className="divider" />

        {/* Sections Below Date Selection / Calendar */}
        <div id="reviews">
          <Reviews property={property} />
        </div>
        <div className="divider" />

        <HostSection host={property.host} />
        <div className="divider" />

        <div id="location">
          <LocationMap 
            city={property.location.city}
            state={property.location.state}
            country={property.location.country}
            neighborhood={property.location.neighborhood}
          />
        </div>

        {/* Breadcrumbs & Explore Section */}
        <div className="explore-options-section">
          <div className="breadcrumbs-row">
            <Link to="/">Airbnb</Link> <span>›</span> <Link to="/?destination=India">{property.location.country}</Link> <span>›</span> <Link to={`/?destination=${property.location.state}`}>{property.location.state}</Link> <span>›</span> <span className="active-breadcrumb">{property.location.city}</span>
          </div>

          <div className="explore-group">
            <h2 className="explore-title">Explore other options in and around {property.location.city}</h2>
            <div className="explore-grid-3col">
              <div className="explore-item" onClick={() => navigate('/?destination=Mumbai')} style={{ cursor: 'pointer' }}>
                <div className="explore-item-name">Mumbai</div>
                <div className="explore-item-sub">Holiday rentals</div>
              </div>
              <div className="explore-item" onClick={() => navigate('/?destination=Goa')} style={{ cursor: 'pointer' }}>
                <div className="explore-item-name">South Goa</div>
                <div className="explore-item-sub">Holiday rentals</div>
              </div>
              <div className="explore-item" onClick={() => navigate('/?destination=Calangute')} style={{ cursor: 'pointer' }}>
                <div className="explore-item-name">Calangute</div>
                <div className="explore-item-sub">Holiday rentals</div>
              </div>
              <div className="explore-item" onClick={() => navigate('/?destination=Kasauli')} style={{ cursor: 'pointer' }}>
                <div className="explore-item-name">Kasauli</div>
                <div className="explore-item-sub">Holiday rentals</div>
              </div>
              <div className="explore-item" onClick={() => navigate('/?destination=Candolim')} style={{ cursor: 'pointer' }}>
                <div className="explore-item-name">Candolim</div>
                <div className="explore-item-sub">Holiday rentals</div>
              </div>
              <div className="explore-item" onClick={() => navigate('/?destination=Arpora')} style={{ cursor: 'pointer' }}>
                <div className="explore-item-name">Arpora</div>
                <div className="explore-item-sub">Holiday rentals</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Full-Screen Photo Tour Overlay */}
      <PhotoTour 
        isOpen={isPhotoTourOpen}
        onClose={() => setIsPhotoTourOpen(false)}
        photos={property.photos}
        onOpenLightbox={handleOpenLightbox}
        propertyTitle={property.title}
      />

      {/* Single Photo Viewer Lightbox Modal */}
      <Lightbox 
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        photos={property.photos}
        currentIndex={lightbox.currentIndex}
        onNext={lightbox.nextPhoto}
        onPrev={lightbox.prevPhoto}
        onOpenPhotoTour={handleOpenPhotoTour}
      />

      {/* Page Footer */}
      <Footer />
    </div>
  );
};
