import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { LoginModal } from '../components/Modals/LoginModal';
import { Heart } from 'lucide-react';
import { mockProperty } from '../data/propertyData';
import { useNavigate } from 'react-router-dom';

export const WishlistsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id?: string; name: string; email: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('airbnb_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      setUser(null);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    const userStr = localStorage.getItem('airbnb_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  };

  return (
    <div className="wishlists-page">
      <Header />
      <main className="page-container" style={{ padding: '40px 24px', minHeight: '65vh' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px' }}>Wishlists</h1>
        
        {!user ? (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px solid #DDDDDD', maxWidth: '560px', margin: '40px auto', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Log in to view your wishlists</h2>
            <p style={{ color: '#717171', fontSize: '15px', marginBottom: '24px', lineHeight: 1.5 }}>
              You can create, view, or save stays to your wishlist once you are logged in.
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
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            <div 
              onClick={() => navigate('/rooms/villa-glasshouse-kasauli-01')} 
              style={{ cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: '1px solid #DDDDDD', padding: '16px' }}
            >
              <img src={mockProperty.photos[0].url} alt={mockProperty.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} fill="#FF385C" color="#FF385C" />
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>Saved Favorites (1)</span>
                </div>
                <p style={{ fontSize: '14px', color: '#717171', marginTop: '4px' }}>{mockProperty.title}</p>
              </div>
            </div>
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
