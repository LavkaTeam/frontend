import { useState } from 'react';
import { StarRating } from '../Star';
import styles from './CardBestseller.module.css';
import { Button } from '../Button';

const rateNumber = 3;
const formatNumber = rateNumber.toFixed(1);

const CardBestseller = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.cardBestseller}
    >
      <div className={styles.cardProduct}>
        <img src='https://i.postimg.cc/HkmKnTJP/img1.png' alt='' />
        <div className={styles.cardProductInfo}>
          <div className={styles.cardInStock}>
            <span className={styles.inStock}>In Stock</span>
            <span className={styles.sku}>SKU. 60613</span>
          </div>
          <div className={styles.cardProductDetails}>
            <span className={styles.heading}>Absolut</span>
            <span className={styles.subHeading}>0.5 l, 0.7 l, 1 l</span>
            <span className={styles.subHeading}>Sweden / Absolut</span>
            <div className={styles.cardRates}>
              <StarRating rate={rateNumber} />
              <span className={styles.rateNumber}>{formatNumber}</span>
            </div>
            <span className={styles.divider}></span>
            <span className={styles.price}>9.50$</span>
          </div>
          {isHovered && (
            <>
              <span className={styles.space}></span>
              <Button>Show more</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export { CardBestseller };
