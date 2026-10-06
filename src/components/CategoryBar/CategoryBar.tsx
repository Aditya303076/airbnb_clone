import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import './CategoryBar.css';

import { CATEGORIES, type CategoryItem } from '../../data/categories';
export type { CategoryItem };

interface CategoryBarProps {
  activeCategory?: string;
  onSelectCategory?: (categoryName: string) => void;
  onOpenFilterModal?: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  activeCategory = '',
  onSelectCategory,
  onOpenFilterModal,
}) => {
  const [selected, setSelected] = useState<string>('');
  const [showTaxes, setShowTaxes] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCategory) {
      const matched = CATEGORIES.find(
        c => c.id.toLowerCase() === activeCategory.toLowerCase() || c.name.toLowerCase() === activeCategory.toLowerCase()
      );
      setSelected(matched ? matched.id : activeCategory.toLowerCase());
    } else {
      setSelected('');
    }
  }, [activeCategory]);

  const handleSelect = (id: string) => {
    const catObj = CATEGORIES.find(c => c.id === id);
    const categoryName = catObj ? catObj.name : id;
    if (selected === id) {
      setSelected('');
      onSelectCategory?.('');
    } else {
      setSelected(id);
      onSelectCategory?.(categoryName);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-bar-wrapper">
      <div className="category-bar-container">
        {/* Left Scroll Chevron */}
        <button 
          className="scroll-btn left-btn" 
          onClick={() => scroll('left')}
          aria-label="Scroll left categories"
        >
          <ChevronLeft size={16} color="#222222" />
        </button>

        {/* Scrollable Categories Track */}
        <div className="category-track" ref={scrollRef}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-item ${selected === cat.id ? 'active' : ''}`}
              onClick={() => handleSelect(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Right Scroll Chevron */}
        <button 
          className="scroll-btn right-btn" 
          onClick={() => scroll('right')}
          aria-label="Scroll right categories"
        >
          <ChevronRight size={16} color="#222222" />
        </button>

        {/* Right Controls: Filters & Tax Toggle */}
        <div className="category-controls">
          <button 
            className="filter-btn" 
            onClick={onOpenFilterModal}
            aria-label="Open filter settings"
          >
            <SlidersHorizontal size={16} color="#222222" />
            <span>Filters</span>
          </button>

          <div className="tax-toggle-wrapper">
            <span className="tax-toggle-label">Display total before taxes</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showTaxes} 
                onChange={(e) => setShowTaxes(e.target.checked)} 
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
