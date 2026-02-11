import type { Product } from '@/types/productCard';

import { DeleteIcon } from '../ui/icons/DeleteIcon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from '@/store/cartSlice';

import styles from './CartProduct.module.css';

type CartProductProps = {
  card: Product;
};

const CartProduct = ({ card }: CartProductProps) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart);

  const item = cartItems.find((item) => item.id === card.id);

  const price = Number(card.price);
  const totalItemPrice = item ? (item.quantity * price).toFixed(2) : '0.00';

  const imageUrl =
    card.mainImage?.url || 'https://placehold.co/400?text=No+Image';

  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardContent}>
          <div className={styles.cardImg}>
            <img src={imageUrl} alt={card.name} />
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardTitle}>
              {card.name},{card.volume && ` ${card.volume} L`}, <br />
              {card.producer}
            </div>
            <div className={styles.price}>
              <span className={styles.cardPrice}>${price.toFixed(2)}</span>
              <div className={styles.quantity}>
                <button
                  onClick={() => dispatch(decreaseQuantity({ id: card.id }))}
                  className={styles.quantityBtn}
                >
                  -
                </button>
                <span className={styles.cardQuantity}>{item?.quantity}</span>
                <button
                  onClick={() => dispatch(increaseQuantity({ id: card.id }))}
                  className={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              <span className={styles.cardTotalPrice}>${totalItemPrice}</span>
            </div>
            <button
              onClick={() => dispatch(removeItem({ id: card.id }))}
              className={styles.deleteButton}
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CartProduct };
