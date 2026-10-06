import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ListingPage } from './pages/ListingPage';
import { WishlistsPage } from './pages/WishlistsPage';
import { TripsPage } from './pages/TripsPage';
import { HostPage } from './pages/HostPage';
import './styles/globals.css';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms/:id" element={<ListingPage />} />
        <Route path="/homes/:id" element={<ListingPage />} />
        <Route path="/photo-tour/:id" element={<ListingPage initialPhotoTourOpen={true} />} />
        <Route path="/wishlists" element={<WishlistsPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/login" element={<HostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
