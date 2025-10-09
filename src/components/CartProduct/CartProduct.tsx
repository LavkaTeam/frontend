import type { ProductCard } from '@/types/productCard';

import { DeleteIcon } from '../ui/icons/DeleteIcon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from '@/store/cartSlice';

import styles from './CartProduct.module.css';

type CartProductProps = {
  card: ProductCard;
};

const CartProduct = ({ card }: CartProductProps) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart);
  const item = cartItems.find((item) => item.id === card.id);
  const totalItemPrice = item ? (item.quantity * card.price).toFixed(2) : '0';

  return (
    <div className={styles.card}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardContent}>
          <div className={styles.cardImg}>
            <img src={card.image} alt={card.title} />
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardTitle}>
              {card.title}, {card.capacity} L, <br />
              {card.brand}
            </div>
            <div className={styles.price}>
              <span className={styles.cardPrice}>${card.price}</span>
              <div className={styles.quantity}>
                <button
                  onClick={() => dispatch(decreaseQuantity({ id: card.id }))}
                >
                  -
                </button>
                <span className={styles.cardQuantity}>{item?.quantity}</span>
                <button
                  onClick={() => dispatch(increaseQuantity({ id: card.id }))}
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
