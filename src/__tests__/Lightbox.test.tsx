import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Lightbox } from '../components/Lightbox/Lightbox';
import { mockProperty } from '../data/propertyData';

describe('Lightbox Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    photos: mockProperty.photos,
    currentIndex: 0,
    onNext: vi.fn(),
    onPrev: vi.fn(),
    onOpenPhotoTour: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<Lightbox {...defaultProps} />);
    expect(screen.getByText(/1 \/ 15/i)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.photos[0].caption)).toBeInTheDocument();
  });

  it('calls onNext when right arrow button is clicked', () => {
    render(<Lightbox {...defaultProps} />);
    const nextBtn = screen.getByLabelText(/next photo/i);
    fireEvent.click(nextBtn);
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev when left arrow button is clicked', () => {
    render(<Lightbox {...defaultProps} />);
    const prevBtn = screen.getByLabelText(/previous photo/i);
    fireEvent.click(prevBtn);
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  it('triggers onClose when Escape key is pressed', () => {
    render(<Lightbox {...defaultProps} />);
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
