import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@ui/Button';
import { OutlineHeart, SolidHeart } from '../Heart';
import { ShoppingCart } from '../ShoppingCart';

import styles from './CardProduct.module.css';
import type { Product } from '@/types/products';

interface CardProductProps {
  card: Product;
}

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
      <Link to={`/product/${card.id}`}>
        <div className={styles.cardImageWrapper}>
          <img src={card.mainImage.url} alt={card.name} />
        </div>
      </Link>
      <div className={styles.cardProductInfo}>
        <Link to={`/product/${card.id}`}>
          <div className={styles.cardInStock}>
            <span className={styles.inStock}>
              {card.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className={styles.sku}>SKU. {card.id}</span>{' '}
          </div>
          <div className={styles.cardProductDetails}>
            <span className={styles.heading}>{card.name}</span>
            {card.volume && (
              <span className={styles.capacity}>{card.volume}</span>
            )}
            <span className={styles.subHeading}>{card.description}</span>
            <span className={styles.divider}></span>
            <span className={styles.price}>${card.price.toFixed(2)}</span>
          </div>
        </Link>
        <Button icon={<ShoppingCart />}>Add to cart</Button>
      </div>
    </div>
  );
};
export { CardProduct };
