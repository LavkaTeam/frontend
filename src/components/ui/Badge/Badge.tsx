import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  type: 'bestseller' | 'sale' | 'ownProduct';
  text?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ type, text, className }) => {
  const badgeText =
    text ||
    (type === 'bestseller'
      ? 'Bestseller'
      : type === 'sale'
        ? 'Sale'
        : 'Your product');
  const typeClass =
    type === 'bestseller'
      ? styles.badgeBestseller
      : type === 'sale'
        ? styles.badgeSale
        : styles.badgeOwnProduct;

  return (
    <div className={`${styles.badge} ${typeClass} ${className || ''}`}>
      {badgeText}
    </div>
  );
};

export { Badge };
