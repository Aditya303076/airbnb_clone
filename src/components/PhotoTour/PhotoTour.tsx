import React, { useState } from 'react';
import { ChevronLeft, Share, Heart } from 'lucide-react';
import type { Photo } from '../../types/property';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { ShareModal } from '../Modals/ShareModal';
import './PhotoTour.css';

interface PhotoTourProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  onOpenLightbox: (index: number) => void;
  propertyTitle: string;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Shared full kitchen': 'Blender · Cooker · Cooking basics · Crockery and cutlery · Freezer · Fridge',
  'Kitchen & Dining': 'Gourmet chef kitchen · Microwave · Oven · Coffee maker · Dishwasher',
  'Shared dining area': 'Dining table · Seating for 6 guests',
  'Bedrooms': 'King size bed · Premium linens · Wardrobe · Valley view deck',
  'Living Room': 'L-shaped sofa · Smart TV · Fireplace · Sunlit lounge area',
  'Bathrooms': 'Ensuite bathroom · Walk-in shower · Soaking bathtub · Fresh towels',
  'Exterior & Views': 'Private patio · Outdoor infinity jacuzzi · Garden view',
  'Balcony': 'Private wooden deck · Panoramic mountain sunrise view'
};

export const PhotoTour: React.FC<PhotoTourProps> = ({
  isOpen,
  onClose,
  photos,
  onOpenLightbox,
  propertyTitle
}) => {
  const modalRef = useModalFocus(isOpen);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isSaved, setIsSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose
  });

  if (!isOpen) return null;

  // Distinct category list
  const categories = Array.from(new Set(photos.map(p => p.category)));

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    const elem = document.getElementById(`photo-cat-${cat.replace(/[^a-zA-Z0-9]/g, '-')}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className="photo-tour-overlay animate-fade-in" 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-tour-heading"
    >
      {/* Top Header Bar */}
      <header className="tour-header">
        <button className="tour-back-btn" onClick={onClose} aria-label="Back to listing">
          <ChevronLeft size={22} />
        </button>

        <div className="tour-header-right">
          <button className="tour-action-btn" onClick={() => setIsShareOpen(true)} aria-label="Share">
            <Share size={16} />
            <span>Share</span>
          </button>
          <button className="tour-action-btn" onClick={() => setIsSaved(!isSaved)} aria-label="Save">
            <Heart size={16} fill={isSaved ? '#FF385C' : 'none'} color={isSaved ? '#FF385C' : '#222222'} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable View */}
      <main className="tour-body-container">
        <div className="tour-content-max">
          {/* Photo Tour Navigation Thumbnail Row (Matching Screenshot 1) */}
          <div className="tour-thumbnail-nav">
            <h1 id="photo-tour-heading" className="photo-tour-nav-title">Photo tour</h1>
            
            <div className="thumbnail-cards-row">
              {categories.map(cat => {
                const firstPhoto = photos.find(p => p.category === cat) || photos[0];
                return (
                  <div
                    key={cat}
                    className={`thumb-card ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <div className="thumb-img-wrapper">
                      <img src={firstPhoto.url} alt={cat} loading="lazy" />
                    </div>
                    <span className="thumb-cat-name">{cat}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Sections with Left Sticky Heading & Right Photos Grid (Matching Screenshots 1, 2 & 3) */}
          <div className="tour-sections-list">
            {categories.map(cat => {
              const catPhotos = photos.filter(p => p.category === cat);
              const description = CATEGORY_DESCRIPTIONS[cat] || 'Comfortable spaces designed for relaxation';

              return (
                <section 
                  key={cat} 
                  id={`photo-cat-${cat.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  className="tour-category-section"
                >
                  {/* Left Column: Sticky Title & Description */}
                  <div className="tour-category-left-sticky">
                    <h2 className="tour-category-title">{cat}</h2>
                    <p className="tour-category-subtext">{description}</p>
                  </div>

                  {/* Right Column: Photos for this Category */}
                  <div className="tour-category-photos-right">
                    {/* First Main Large Photo */}
                    {catPhotos.length > 0 && (() => {
                      const firstPhoto = catPhotos[0];
                      const globalIndex = photos.findIndex(p => p.id === firstPhoto.id);
                      return (
                        <div 
                          key={firstPhoto.id}
                          className="tour-photo-card main-card"
                          onClick={() => onOpenLightbox(globalIndex)}
                          role="button"
                          tabIndex={0}
                          aria-label={`View photo: ${firstPhoto.caption}`}
                          onKeyDown={(e) => e.key === 'Enter' && onOpenLightbox(globalIndex)}
                        >
                          <div className="tour-img-wrapper">
                            <img src={firstPhoto.url} alt={firstPhoto.caption} loading="lazy" />
                            <div className="tour-img-hover-overlay">
                              <span>View fullscreen</span>
                            </div>
                          </div>
                          {firstPhoto.caption && <p className="tour-photo-caption">{firstPhoto.caption}</p>}
                        </div>
                      );
                    })()}

                    {/* Subsequent Photos in 2-Column Grid */}
                    {catPhotos.length > 1 && (
                      <div className="photos-grid-2col">
                        {catPhotos.slice(1).map(photo => {
                          const globalIndex = photos.findIndex(p => p.id === photo.id);
                          return (
                            <div 
                              key={photo.id}
                              className="tour-photo-card sub-card"
                              onClick={() => onOpenLightbox(globalIndex)}
                              role="button"
                              tabIndex={0}
                              aria-label={`View photo: ${photo.caption}`}
                              onKeyDown={(e) => e.key === 'Enter' && onOpenLightbox(globalIndex)}
                            >
                              <div className="tour-img-wrapper">
                                <img src={photo.url} alt={photo.caption} loading="lazy" />
                                <div className="tour-img-hover-overlay">
                                  <span>View fullscreen</span>
                                </div>
                              </div>
                              {photo.caption && <p className="tour-photo-caption">{photo.caption}</p>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        propertyTitle={propertyTitle}
      />
    </div>
  );
};
