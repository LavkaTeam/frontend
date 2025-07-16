import { useState, useEffect } from 'react';

interface WithId {
  id: string | number;
}

export const useRandomCards = <T extends WithId>(allCards: T[]) => {
  const [randomCards, setRandomCards] = useState<T[]>([]);

  useEffect(() => {
    const shuffleCards = () => {
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 4);
    };

    setRandomCards(shuffleCards());
  }, [allCards]);

  return randomCards;
};
