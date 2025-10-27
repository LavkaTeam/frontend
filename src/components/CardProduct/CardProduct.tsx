import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@ui/Button';
import { OutlineHeart, SolidHeart } from '../ui/icons/Heart';
import { ShoppingCart } from '../ShoppingCart';
import type { ProductCard } from '@/types/productCard';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/cartSlice';
import { Price } from '../Price';

import styles from './CardProduct.module.css';

type CardProductProps = {
  card: ProductCard;
};

const CardProduct = ({ card }: CardProductProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useAppDispatch();

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
          <img src={card.image} alt={card.title} />
        </div>
      </Link>
      <div className={styles.cardProductInfo}>
        <Link to={`/product/${card.id}`}>
          <div className={styles.cardInStock}>
            {card.inStock ? (
              <span className={styles.inStock}>In Stock</span>
            ) : (
              <span className={styles.soldOut}>Sold Out</span>
            )}
          </div>
          <div className={styles.cardProductDetails}>
            <span className={styles.heading}>{card.title}</span>
            {card.capacity && (
              <span className={styles.capacity}>
                {card.capacity} L / {card.abv} ABV
              </span>
            )}
            <span className={styles.subHeading}>
              {card.country} / {card.brand}
            </span>
            <span className={styles.sku}>{card.sku}</span>
            <span className={styles.divider}></span>
            <Price price={card.price} />
          </div>
        </Link>
        <Button onClick={() => dispatch(addItem(card))} icon={<ShoppingCart />}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};
export { CardProduct };
