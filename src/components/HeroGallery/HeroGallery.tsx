import React from 'react';
import { Grid } from 'lucide-react';
import type { Photo } from '../../types/property';
import './HeroGallery.css';

interface HeroGalleryProps {
  photos: Photo[];
  onOpenPhotoTour: () => void;
  onOpenLightbox: (index: number) => void;
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({
  photos,
  onOpenPhotoTour,
  onOpenLightbox,
}) => {
  // Extract top 5 photos for hero display
  const heroPhotos = photos.slice(0, 5);

  return (
    <div className="hero-gallery-container">
      <div className="hero-gallery-grid">
        {/* Main Left Hero Photo */}
        {heroPhotos[0] && (
          <div 
            className="gallery-item hero-main"
            onClick={() => onOpenLightbox(0)}
            role="button"
            tabIndex={0}
            aria-label={`View photo 1: ${heroPhotos[0].caption}`}
            onKeyDown={(e) => e.key === 'Enter' && onOpenLightbox(0)}
          >
            <img 
              src={heroPhotos[0].url} 
              alt={heroPhotos[0].caption}
              loading="eager"
            />
            <div className="item-overlay" />
          </div>
        )}

        {/* 4 Secondary Grid Photos */}
        <div className="hero-subgrid">
          {heroPhotos.slice(1, 5).map((photo, index) => {
            const photoIndex = index + 1;
            return (
              <div 
                key={photo.id}
                className={`gallery-item hero-sub item-sub-${index + 1}`}
                onClick={() => onOpenLightbox(photoIndex)}
                role="button"
                tabIndex={0}
                aria-label={`View photo ${photoIndex + 1}: ${photo.caption}`}
                onKeyDown={(e) => e.key === 'Enter' && onOpenLightbox(photoIndex)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <div className="item-overlay" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Show All Photos Button */}
      <button 
        className="show-all-photos-btn"
        onClick={onOpenPhotoTour}
        aria-label={`Show all ${photos.length} photos`}
      >
        <Grid size={16} />
        <span>Show all photos</span>
      </button>
    </div>
  );
};
