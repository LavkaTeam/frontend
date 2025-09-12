import { useState, useEffect } from 'react';

const useTabSelection = (initialTab: string, availableTabs: string[]) => {
  const [activeTab, setActiveTab] = useState(
    availableTabs.includes(initialTab) ? initialTab : availableTabs[0] || ''
  );

  // Оновлюємо активну вкладку, якщо availableTabs змінився
  useEffect(() => {
    if (!availableTabs.includes(activeTab) && availableTabs.length > 0) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const handleTabChange = (tab: string) => {
    if (availableTabs.includes(tab)) {
      setActiveTab(tab);
    }
  };

  return { activeTab, handleTabChange };
};

export default useTabSelection;
