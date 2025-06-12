import { useState } from 'react';

const useSlider = (totalItems: number, itemsPerPage: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  return {
    currentIndex,
    maxIndex,
    handleNext,
    handlePrev,
  };
};

export { useSlider };
