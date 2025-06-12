import { useState } from 'react';

const useSlider = (totalItems: number, itemsPerPage: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return {
    currentIndex,
    maxIndex,
    handleNext,
    handlePrev,
  };
};

export { useSlider };
