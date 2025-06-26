import { useState } from 'react';

const useFiltersClear = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [capacityFilters, setCapacityFilters] = useState<Record<string, boolean>>({});
  const [strengthFilters, setStrengthFilters] = useState<Record<string, boolean>>({});
  const [showPromotions, setShowPromotions] = useState(false);

  const clearFilters = () => {
    setFromValue('');
    setToValue('');
    setSelectedCountry('United States');
    setCapacityFilters({});
    setStrengthFilters({});
    setShowPromotions(false);
  };

  return {
    fromValue,
    setFromValue,
    toValue,
    setToValue,
    selectedCountry,
    setSelectedCountry,
    capacityFilters,
    setCapacityFilters,
    strengthFilters,
    setStrengthFilters,
    showPromotions,
    setShowPromotions,
    clearFilters,
  };
};

export { useFiltersClear };