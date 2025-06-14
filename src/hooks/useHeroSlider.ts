import { useState, useEffect, useRef } from 'react';

export const useHeroSlider = (cards: { length: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const SliderTime = 6000; // 6 сек

  const startSlider = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, SliderTime);
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
  });

  const handleMouseDown = () => stopSlider();

  const handleMouseUp = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    startSlider();
  };

  return {
    currentIndex,
    handleMouseDown,
    handleMouseUp,
    stopSlider,
    startSlider,
  };
};
