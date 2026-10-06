import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import type { Property } from '../../types/property';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import './Reviews.css';

interface ReviewsProps {
  property: Property;
}

export const Reviews: React.FC<ReviewsProps> = ({ property }) => {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const modalRef = useModalFocus(isReviewsModalOpen);

  useKeyboardNavigation({
    enabled: isReviewsModalOpen,
    onEscape: () => setIsReviewsModalOpen(false)
  });

  const scores = property.reviewCategoryScores || {
    cleanliness: 5,
    accuracy: 5,
    checkIn: 5,
    communication: 5,
    location: 5,
    value: 5
  };

  const categoryScoreList = [
    { label: 'Cleanliness', score: scores.cleanliness },
    { label: 'Accuracy', score: scores.accuracy },
    { label: 'Check-in', score: scores.checkIn },
    { label: 'Communication', score: scores.communication },
    { label: 'Location', score: scores.location },
    { label: 'Value', score: scores.value },
  ];

  return (
    <div className="reviews-section" id="reviews">
      {/* Hero Laurel Wreath 5.0 Rating Banner (Matching Screenshot 4) */}
      <div className="reviews-hero-wreath-container">
        <div className="wreath-graphic-row">
          <span className="wreath-leaf left-leaf">🌿</span>
          <span className="wreath-giant-score">5.0</span>
          <span className="wreath-leaf right-leaf">🌿</span>
        </div>
        <h2 className="wreath-main-heading">Guest favourite</h2>
        <p className="wreath-sub-text">
          This home is in the top 5% of eligible listings based on ratings, reviews and reliability
        </p>
        <button className="how-reviews-work-link">How reviews work</button>
      </div>

      {/* Horizontal 7-Column Rating Sub-Scores Grid (Matching Screenshot 4) */}
      <div className="rating-horizontal-7col-grid">
        <div className="rating-col-item">
          <div className="col-label-title">Overall rating</div>
          <div className="bar-chart-visual">
            <div className="bar-line full" />
            <div className="bar-line" />
            <div className="bar-line" />
            <div className="bar-line" />
            <div className="bar-line" />
          </div>
        </div>

        <div className="rating-col-item border-left">
          <div className="col-label-title">Cleanliness</div>
          <div className="col-score-val">5.0</div>
          <div className="col-icon">🧴</div>
        </div>

        <div className="rating-col-item border-left">
          <div className="col-label-title">Accuracy</div>
          <div className="col-score-val">5.0</div>
          <div className="col-icon">☑️</div>
        </div>

        <div className="rating-col-item border-left">
          <div className="col-label-title">Check-in</div>
          <div className="col-score-val">5.0</div>
          <div className="col-icon">🔑</div>
        </div>

        <div className="rating-col-item border-left">
          <div className="col-label-title">Communication</div>
          <div className="col-score-val">5.0</div>
          <div className="col-icon">💬</div>
        </div>

        <div className="rating-col-item border-left">
          <div className="col-label-title">Location</div>
          <div className="col-score-val">4.9</div>
          <div className="col-icon">🗺️</div>
        </div>

        <div className="rating-col-item border-left">
          <div className="col-label-title">Value</div>
          <div className="col-score-val">4.9</div>
          <div className="col-icon">🏷️</div>
        </div>
      </div>

      {/* Guest Reviews Mention Carousel Chips (Matching Screenshot 3) */}
      <div className="reviews-mention-section">
        <h3 className="mention-title">Guest reviews mention</h3>
        <div className="mention-chips-row">
          <button className="mention-chip">
            <span>🏖️</span> <span>Beach 28</span>
          </button>
          <button className="mention-chip">
            <span>🎁</span> <span>Hospitality 184</span>
          </button>
          <button className="mention-chip">
            <span>🧹</span> <span>Cleanliness 90</span>
          </button>
          <button className="mention-chip">
            <span>🏊</span> <span>Pool 12</span>
          </button>
          <button className="mention-chip">
            <span>📍</span> <span>Location 73</span>
          </button>
          <button className="mention-chip">
            <span>🛏️</span> <span>Comfort 41</span>
          </button>
          <button className="mention-chip">
            <span>🧸</span> <span>Family 49</span>
          </button>
          <button className="mention-chip">
            <span>🧺</span> <span>Amenities</span>
          </button>
        </div>
      </div>

      {/* Sub-Scores Grid */}
      <div className="scores-grid">
        {categoryScoreList.map((cat) => (
          <div key={cat.label} className="score-row">
            <span className="score-label">{cat.label}</span>
            <div className="score-right">
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(cat.score / 5) * 100}%` }} 
                />
              </div>
              <span className="score-val">{cat.score.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Cards Grid */}
      <div className="review-cards-grid">
        {property.reviews.slice(0, 6).map((rev) => (
          <div key={rev.id} className="review-card">
            <div className="reviewer-info">
              <img 
                src={rev.authorAvatar} 
                alt={rev.author} 
                className="reviewer-avatar" 
              />
              <div>
                <h3 className="reviewer-name">{rev.author}</h3>
                <p className="reviewer-location">{rev.authorLocation}</p>
              </div>
            </div>

            <div className="review-meta">
              <div className="star-row">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={10} fill="#222222" color="#222222" />
                ))}
              </div>
              <span className="review-date">{rev.date}</span>
              <span className="review-stay">· {rev.stayDuration}</span>
            </div>

            <p className="review-comment">{rev.comment}</p>
          </div>
        ))}
      </div>

      {/* Show All Reviews Button */}
      <button 
        className="show-all-reviews-btn"
        onClick={() => setIsReviewsModalOpen(true)}
      >
        Show all {property.reviewCount} reviews
      </button>

      {/* All Reviews Modal Dialog */}
      {isReviewsModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsReviewsModalOpen(false)} role="presentation">
          <div 
            className="modal-content reviews-modal-content animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reviews-modal-title"
          >
            <div className="modal-header">
              <button className="close-modal-btn" onClick={() => setIsReviewsModalOpen(false)} aria-label="Close reviews dialog">
                <X size={18} />
              </button>
              <h2 id="reviews-modal-title" className="modal-title">
                ★ {property.rating.toFixed(2)} · {property.reviewCount} reviews
              </h2>
            </div>

            <div className="modal-body reviews-modal-body">
              <div className="reviews-modal-layout">
                {/* Left Sub-Scores Sticky Panel */}
                <div className="modal-scores-side">
                  {categoryScoreList.map((cat) => (
                    <div key={cat.label} className="score-row margin-bottom">
                      <span className="score-label">{cat.label}</span>
                      <div className="score-right">
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${(cat.score / 5) * 100}%` }} />
                        </div>
                        <span className="score-val">{cat.score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Scrollable Reviews Stream */}
                <div className="modal-reviews-stream">
                  {property.reviews.map((rev) => (
                    <div key={rev.id} className="modal-review-item">
                      <div className="reviewer-info">
                        <img src={rev.authorAvatar} alt={rev.author} className="reviewer-avatar" />
                        <div>
                          <h3 className="reviewer-name">{rev.author}</h3>
                          <p className="reviewer-location">{rev.authorLocation}</p>
                        </div>
                      </div>
                      <div className="review-meta">
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <p className="review-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
