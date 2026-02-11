import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { OutlineHeart, SolidHeart } from '@/components/ui/icons/Heart';
import { ShoppingCart } from '@/components/ShoppingCart';
import type { Product } from '@/types/productCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addItem } from '@/store/cartSlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import { Price } from '../Price';
import styles from './CardProduct.module.css';

type CardProductProps = {
  card: Product;
};

const CardProduct = ({ card }: CardProductProps) => {
  const dispatch = useAppDispatch();

  const isFavorite = useAppSelector((state: any) =>
    state.favorites.includes(card.id),
  );

  const imageUrl =
    card.mainImage?.url || 'https://placehold.co/400?text=No+Image';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
          <img src={imageUrl} alt={card.name} />
        </div>
      </Link>

      <div className={styles.cardProductInfo}>
        <Link to={`/product/${card.id}`}>
          <div className={styles.cardInStock}>
            {card.quantity > 0 ? (
              <span className={styles.inStock}>In Stock</span>
            ) : (
              <span className={styles.soldOut}>Sold Out</span>
            )}
          </div>
          <div className={styles.cardProductDetails}>
            <span className={styles.heading}>{card.name}</span>

            {card.volume && (
              <span className={styles.capacity}>
                {card.volume || 'N/A'} L /{' '}
                {card.alcohol || card.alcohol >= 0 ? `${card.alcohol}%` : 'N/A'}{' '}
                ABV
              </span>
            )}

            <span className={styles.subHeading}>
              {card.producer || 'N/A'} / {card.country || 'N/A'}
              {/* COMPANY поки немає на бекенді*/}
            </span>

            <span className={styles.sku}>SKU: {card.id.slice(0, 8)}</span>

            <span className={styles.divider}></span>
            <Price price={card.price} />
          </div>
        </Link>

        <Button
          disabled={card.quantity <= 0}
          onClick={handleAddToCart}
          icon={<ShoppingCart />}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export { CardProduct };
