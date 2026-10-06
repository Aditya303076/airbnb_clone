import React from 'react';
import { ChevronLeft, ChevronRight, X, Grid } from 'lucide-react';
import type { Photo } from '../../types/property';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import './Lightbox.css';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onOpenPhotoTour?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  photos,
  currentIndex,
  onNext,
  onPrev,
  onOpenPhotoTour,
}) => {
  const modalRef = useModalFocus(isOpen);

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose,
    onArrowLeft: onPrev,
    onArrowRight: onNext,
  });

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <div 
      className="lightbox-overlay animate-fade-in"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-caption"
    >
      {/* Lightbox Top Header */}
      <div className="lightbox-header">
        <button className="lightbox-close-btn" onClick={onClose} aria-label="Close photo viewer (Esc)">
          <X size={20} color="#FFFFFF" />
          <span className="close-text">Close</span>
        </button>

        <div className="lightbox-counter">
          {currentIndex + 1} / {photos.length}
        </div>

        {onOpenPhotoTour ? (
          <button className="lightbox-grid-btn" onClick={onOpenPhotoTour} aria-label="Show all photos grid">
            <Grid size={16} color="#FFFFFF" />
            <span>Show all photos</span>
          </button>
        ) : <div style={{ width: '120px' }} />}
      </div>

      {/* Main Photo Container */}
      <div className="lightbox-main-stage">
        {/* Previous Button */}
        <button 
          className="lightbox-nav-btn prev-btn" 
          onClick={onPrev}
          aria-label="Previous photo (Left arrow)"
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </button>

        {/* Active Image */}
        <div className="lightbox-image-wrapper">
          <img 
            key={currentPhoto.id}
            src={currentPhoto.url} 
            alt={currentPhoto.caption}
            className="lightbox-img animate-scale-up"
          />
        </div>

        {/* Next Button */}
        <button 
          className="lightbox-nav-btn next-btn" 
          onClick={onNext}
          aria-label="Next photo (Right arrow)"
        >
          <ChevronRight size={24} color="#FFFFFF" />
        </button>
      </div>

      {/* Lightbox Footer Caption */}
      <div className="lightbox-footer">
        <p id="lightbox-caption" className="lightbox-caption-text">
          <span className="lightbox-category-tag">{currentPhoto.category}</span>
          <span className="lightbox-dot">·</span>
          <span>{currentPhoto.caption}</span>
        </p>
      </div>
    </div>
  );
};
