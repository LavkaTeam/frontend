import { CartProduct } from '@/components/CartProduct';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { SubHeading } from '@/components/ui/SubHeading';
import { useAppSelector } from '@/store/hooks';

import { Button } from '@/components/ui/Button';
import { CartIcon } from '@/components/ui/icons/CartIcon';

import styles from './Cart.module.css';

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart);
  const discount = 15;
  const shippingFree = 79;

  const subTotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const dph = subTotal * 0.21;

  const total = subTotal + dph + shippingFree - discount;

  return (
    <main className='container'>
      <div className={styles.cart}>
        <HeadingH3>Cart</HeadingH3>
        <div className={styles.cartLayout}>
          <section>
            <SubHeading>Goods</SubHeading>
            {cartItems.map((item) => (
              <CartProduct key={item.id} card={item} />
            ))}
          </section>
          <aside>
            <SubHeading>Total</SubHeading>
            <div className={styles.totalPrice}>
              <div className={styles.totalInfo}>
                <p>Sub-Total:</p>
                <span className={styles.price}>${subTotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalInfo}>
                <p>DPH 21%:</p>
                <span className={styles.price}>${dph.toFixed(2)}</span>
              </div>
              <div className={styles.totalInfo}>
                <p>Discount:</p>
                <span className={styles.price}>-${discount}</span>
              </div>
              <div className={styles.totalInfoWithBorder}>
                <span>
                  Shipping free depending <br /> on the number of items:
                </span>
                <span className={styles.price}>$79</span>
              </div>
              <div className={styles.totalInfo}>
                <p>Total:</p>
                <span className={styles.greenPrice}>${total.toFixed(2)}</span>
              </div>
              <div className={styles.checkoutButton}>
                <Button icon={<CartIcon />}>Checkout</Button>
              </div>
              <Button variant='secondary'>Continue Shopping</Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
