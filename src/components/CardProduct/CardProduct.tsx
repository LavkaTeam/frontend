import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@ui/Button';
import { OutlineHeart, SolidHeart } from '../Heart';
import { ShoppingCart } from '../ShoppingCart';
import type { ProductCard } from '@/types/productCard';

import styles from './CardProduct.module.css';

type CardProductProps = {
  card: ProductCard;
};

const CardProduct = ({ card }: CardProductProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={styles.cardProduct}>
      <div
        className={styles.favoriteIcon}
        onClick={() => setIsFavorite(!isFavorite)}
      >
        {isFavorite ? <SolidHeart /> : <OutlineHeart />}
      </div>
      <Link to={`product/${card.id}`}>
        <div className={styles.cardImageWrapper}>
          <img src={card.image} alt={card.title} />
        </div>
      </Link>
      <div className={styles.cardProductInfo}>
        <Link to={`product/${card.id}`}>
          <div className={styles.cardInStock}>
            <span className={styles.inStock}>In Stock</span>
          </div>
          <div className={styles.cardProductDetails}>
            <span className={styles.heading}>{card.title}</span>
            {card.capacity && (
              <span className={styles.capacity}>{card.capacity}</span>
            )}
            <span className={styles.subHeading}>{card.description}</span>
            <span className={styles.sku}>{card.sku}</span>
            <span className={styles.divider}></span>
            <span className={styles.price}>{card.price}</span>
          </div>
        </Link>
        <Button icon={<ShoppingCart />}>Add to cart</Button>
      </div>
    </div>
  );
};
export { CardProduct };
