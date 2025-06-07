import { useState, useEffect, useRef } from 'react';

export const useHeroSlider = (cards: { length: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlider = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 6000);
  };

  const stopSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startSlider();
    return () => stopSlider();
  }, [cards.length]);

  const handleMouseDown = () => stopSlider();
  const handleMouseUp = () => startSlider();

  return {
    currentIndex,
    handleMouseDown,
    handleMouseUp,
    stopSlider,
    startSlider,
  };
};