import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  type: 'bestseller' | 'sale';
  text?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ type, text, className }) => {
  const badgeText = text || (type === 'bestseller' ? 'Bestseller' : 'Sale');
  const typeClass = type === 'bestseller' ? styles.badgeBestseller : styles.badgeSale;

  return (
    <div className={`${styles.badge} ${typeClass} ${className || ''}`}>
      {badgeText}
    </div>
  );
};

export { Badge };
