import { useState } from 'react';
import { Button } from '../Button';
import { StarRating } from '../Star';
import { OutlineHeart, SolidHeart } from '../Heart';
import { ShoppingCart } from '../ShoppingCart';

import styles from './CardProduct.module.css';

const CardProduct = ({ card }: any) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const rate = card.rating.rate;
  const formatRate = rate.toFixed(1);

  return (
    <div className={styles.cardProduct}>
      <div
        className={styles.favoriteIcon}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        {isFavorite ? <SolidHeart /> : <OutlineHeart />}
      </div>
      <div className={styles.cardImageWrapper}>
        <img src={card.image} alt={card.title} />
      </div>
      <div className={styles.cardProductInfo}>
        <div className={styles.cardInStock}>
          <span className={styles.inStock}>In Stock</span>
          <span className={styles.sku}>{card.sku}</span>
        </div>
        <div className={styles.cardProductDetails}>
          <span className={styles.heading}>{card.title}</span>
          {card.capacity && (
            <span className={styles.capacity}>{card.capacity}</span>
          )}
          <span className={styles.subHeading}>{card.description}</span>
          <div className={styles.cardRates}>
            <StarRating rate={card.rating.rate} />
            <span className={styles.rateNumber}>{formatRate}</span>
          </div>
          <span className={styles.divider}></span>
          <span className={styles.price}>{card.price}</span>
        </div>
        <Button icon={<ShoppingCart />}>Add to cart</Button>
      </div>
    </div>
  );
};
export { CardProduct };
