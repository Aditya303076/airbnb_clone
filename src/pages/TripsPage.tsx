import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { LoginModal } from '../components/Modals/LoginModal';
import { ApiClient } from '../services/apiClient';
import { cancelLocalReservation } from '../services/reservationStore';
import type { Property } from '../types/property';
import { mockProperty } from '../data/propertyData';

interface TripItem {
  id: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  property?: Property;
}

export const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id?: string; name: string; email: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const userStr = localStorage.getItem('airbnb_user');
    if (!userStr) {
      setUser(null);
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
    const userId = parsedUser?.id || 'usr-guest-001';

    ApiClient.getUserReservations(userId).then(async (res) => {
      if (!isMounted) return;
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        // Hydrate property details for each reservation
        const hydrated = await Promise.all(
          res.data.map(async (r: TripItem) => {
            const propRes = await ApiClient.getPropertyById(r.propertyId);
            return {
              ...r,
              property: propRes && propRes.success ? propRes.data : mockProperty,
            };
          })
        );
        setTrips(hydrated);
      } else {
        setTrips([]);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    const userStr = localStorage.getItem('airbnb_user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      setLoading(true);
      ApiClient.getUserReservations(parsedUser.id || 'usr-guest-001').then(async (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const hydrated = await Promise.all(
            res.data.map(async (r: TripItem) => {
              const propRes = await ApiClient.getPropertyById(r.propertyId);
              return {
                ...r,
                property: propRes && propRes.success ? propRes.data : mockProperty,
              };
            })
          );
          setTrips(hydrated);
        }
        setLoading(false);
      });
    }
  };

  const handleCancel = async (id: string) => {
    const userStr = localStorage.getItem('airbnb_user');
    if (!userStr) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    await ApiClient.cancelReservation(id);
    cancelLocalReservation(id);
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'CANCELLED' } : t)));
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="trips-page">
      <Header />
      <main className="page-container" style={{ padding: '40px 24px', minHeight: '65vh' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>Trips & Bookings</h1>

        {!user ? (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px solid #DDDDDD', maxWidth: '560px', margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧳</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Log in to view your trips</h2>
            <p style={{ color: '#717171', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
              You must log in or sign up to view your bookings, check payment details, or cancel existing reservations.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              style={{
                padding: '14px 28px',
                backgroundColor: '#FF385C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Log in or sign up
            </button>
          </div>
        ) : loading ? (
          <p style={{ color: '#717171' }}>Loading your reservations...</p>
        ) : trips.length === 0 ? (
          <div style={{ background: '#F7F7F7', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No bookings booked... yet!</h2>
            <p style={{ color: '#717171', marginBottom: '16px' }}>Time to dust off your bags and start planning your next adventure.</p>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '12px 24px', backgroundColor: '#FF385C', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Start searching
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {trips.map((trip) => {
              const prop = trip.property || mockProperty;
              return (
                <div
                  key={trip.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'center',
                    border: '1px solid #DDDDDD',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <img
                    src={prop.photos?.[0]?.url || mockProperty.photos[0].url}
                    alt={prop.title}
                    style={{ width: '180px', height: '130px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: trip.status === 'CONFIRMED' ? '#E6F4EA' : '#FCE8E6',
                          color: trip.status === 'CONFIRMED' ? '#137333' : '#C5221F',
                        }}
                      >
                        {trip.status === 'CONFIRMED' ? 'Confirmed Reservation' : 'Cancelled'}
                      </span>
                      <span style={{ fontSize: '13px', color: '#717171' }}>Booking ID: {trip.id}</span>
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0' }}>{prop.title}</h2>
                    <p style={{ fontSize: '14px', color: '#717171', marginBottom: '8px' }}>
                      {formatDate(trip.checkIn)} – {formatDate(trip.checkOut)} · {prop.location?.city || 'Goa'}, {prop.location?.country || 'India'}
                    </p>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button
                        onClick={() => navigate(`/rooms/${prop.id}`)}
                        style={{ padding: '8px 16px', border: '1px solid #222222', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                      >
                        View Property
                      </button>
                      {trip.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancel(trip.id)}
                          style={{ padding: '8px 16px', border: '1px solid #C5221F', color: '#C5221F', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', backgroundColor: '#FFFFFF' }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', color: '#717171' }}>Total Paid</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#222222' }}>
                      {prop.price?.currencySymbol || '₹'}{trip.totalPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>
      <Footer />
    </div>
  );
};
