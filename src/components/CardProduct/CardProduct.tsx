import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { OutlineHeart, SolidHeart } from '@/components/ui/icons/Heart';
import { ShoppingCart } from '@/components/ShoppingCart';
import type { ProductCard } from '@/types/productCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItem } from '@/store/cartSlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import { Price } from '../Price';
import styles from './CardProduct.module.css';

type CardProductProps = {
  card: ProductCard;
};

const CardProduct = ({ card }: CardProductProps) => {
  const dispatch = useAppDispatch();

  // Перевіряємо в Redux, чи є цей ID в списку favorites
  const isFavorite = useAppSelector((state: any) =>
    state.favorites.includes(card.id),
  );

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Запобігаємо переходу за посиланням картки
    e.stopPropagation();
    dispatch(toggleFavorite(card.id));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem(card));
  };

  return (
    <div className={styles.cardProduct}>
      <div className={styles.favoriteIcon} onClick={handleFavoriteClick}>
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

        <Button onClick={handleAddToCart} icon={<ShoppingCart />}>
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export { CardProduct };
