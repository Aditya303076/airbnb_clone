import { useState, useCallback } from 'react';

export interface UseLightboxReturn {
  isOpen: boolean;
  currentIndex: number;
  openLightbox: (index?: number) => void;
  closeLightbox: () => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  setIndex: (index: number) => void;
}

export function useLightbox(totalPhotos: number): UseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  const setIndex = useCallback((index: number) => {
    if (index >= 0 && index < totalPhotos) {
      setCurrentIndex(index);
    }
  }, [totalPhotos]);

  return {
    isOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
    nextPhoto,
    prevPhoto,
    setIndex
  };
}
