import { Link, useNavigate } from 'react-router-dom';
import { CartProduct, CartProductSkeleton } from '@/components/CartProduct';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { SubHeading } from '@/components/ui/SubHeading';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/Button';
import { CartIcon } from '@/components/ui/icons/CartIcon';
import { LoginIcon } from '@/components/ui/icons/LoginIcon';
import { Space } from '@/components/ui/Space';
import { EmptyCartIcon } from '@/components/ui/icons/EmptyCartIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { HeaderMenu } from '@/components/HeaderMenu';

import { useCartActions } from '@/hooks/useCartActions';
import { useGetCart } from '@/hooks/useCartQueries';
import {
  buildSellerCartGroups,
  formatCartWeight,
  getCartTotals,
  toCartDisplayItems,
} from '@/features/cart/model/cartView';
import { useIsShopper } from '@/hooks/useIsAuthenticated';

import styles from './Cart.module.css';

const LockIcon = () => (
  <svg
    className={styles.guestNoticeIcon}
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <rect x='4' y='11' width='16' height='10' rx='2' />
    <path d='M8 11V7a4 4 0 0 1 8 0v4' />
  </svg>
);

const Cart = () => {
  const navigate = useNavigate();
  // The admin has no cart or favorites: treated as a guest here.
  const isAuthenticated = useIsShopper();

  const localCartItems = useAppSelector((state) => state.cart);
  const { data: remoteCart, isLoading } = useGetCart(isAuthenticated);
  const { clearCart, getCartItemQuantity, isClearing } = useCartActions();

  const showSkeletons = (isAuthenticated && isLoading) || isClearing;

  const cartItems = toCartDisplayItems(
    isAuthenticated,
    remoteCart?.items,
    localCartItems,
  );

  const uniqueItemCount = new Set(cartItems.map((item) => item.id)).size;

  const quantities = isAuthenticated
    ? Object.fromEntries(
        (remoteCart?.items || []).map((item) => [
          item.productId,
          getCartItemQuantity(item.productId),
        ]),
      )
    : Object.fromEntries(
        localCartItems.map((item) => [item.id, item.quantity]),
      );

  const sellerGroups = buildSellerCartGroups(cartItems, isAuthenticated);
  const { subTotal, dph, total, totalItems, totalWeight } = getCartTotals(
    isAuthenticated,
    remoteCart,
    localCartItems,
  );

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      // React Router keeps `state` in history.state.usr; the login handler
      // reads `from` from there and returns the user to checkout.
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  return (
    <>
      <HeaderMenu />
      <main className='container'>
        <div className={styles.cart}>
          {showSkeletons ? (
            <>
              <div className={styles.headerWrapper}>
                <HeadingH3>Cart</HeadingH3>
              </div>

              <Space height='32px' />
              <div className={styles.cartLayout}>
                <section>
                  <SubHeading>Loading Goods...</SubHeading>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CartProductSkeleton key={index} />
                  ))}
                </section>
                <aside className={styles.aside}>
                  <SubHeading>Total</SubHeading>
                  <div className={styles.totalPrice}>
                    <div className={styles.summaryBlock}>
                      <div className={styles.totalInfo}>
                        <p>Sub-Total:</p>
                        <span
                          className={`${styles.skeletonLine} ${styles.skeletonLineMd}`}
                        ></span>
                      </div>
                    </div>
                    <div className={styles.summaryBlock}>
                      <div className={styles.totalInfo}>
                        <p>Total items:</p>
                        <span
                          className={`${styles.skeletonLine} ${styles.skeletonLineSm}`}
                        ></span>
                      </div>
                      <div className={styles.totalInfo}>
                        <p>Total weight:</p>
                        <span
                          className={`${styles.skeletonLine} ${styles.skeletonLineMd}`}
                        ></span>
                      </div>
                      <div className={styles.totalInfo}>
                        <p>Shipping fee:</p>
                        <span
                          className={`${styles.skeletonLine} ${styles.skeletonLineLg}`}
                        ></span>
                      </div>
                    </div>
                    <div
                      className={`${styles.summaryBlock} ${styles.totalBlock}`}
                    >
                      <div className={styles.totalInfo}>
                        <p>Total tax:</p>
                        <span
                          className={`${styles.skeletonLine} ${styles.skeletonLineMd}`}
                        ></span>
                      </div>
                      <div className={styles.totalInfo}>
                        <p>Total:</p>
                        <span
                          className={`${styles.skeletonLine} ${styles.skeletonLineLg}`}
                        ></span>
                      </div>
                    </div>
                    <div className={styles.checkoutButton}>
                      <Button disabled icon={<CartIcon />}>
                        Checkout
                      </Button>
                    </div>
                    <Link to='/products'>
                      <Button variant='secondary'>Continue Shopping</Button>
                    </Link>
                  </div>
                </aside>
              </div>
            </>
          ) : cartItems.length > 0 ? (
            <>
              <div className={styles.headerWrapper}>
                <HeadingH3>Cart</HeadingH3>
                <button onClick={clearCart} className={styles.clearButton}>
                  <TrashIcon
                    width='44'
                    height='44'
                    color='var(--color-brand-dark-burgundy)'
                  />
                </button>
              </div>

              <Space height='32px' />
              <div className={styles.cartLayout}>
                <section className={styles.cardsLayout}>
                  <div className={styles.sectionHeading}>
                    <SubHeading>{uniqueItemCount} Goods</SubHeading>
                    {sellerGroups.length > 1 ? (
                      <>
                        <span
                          className={styles.sectionSeparator}
                          aria-hidden='true'
                        />
                        <span className={styles.separateOrdersInfo}>
                          Orders from {sellerGroups.length} sellers
                        </span>
                      </>
                    ) : null}
                  </div>
                  {sellerGroups.length === 1 ? (
                    <div className={styles.singleSellerItems}>
                      {sellerGroups[0].items.map((item) => (
                        <CartProduct
                          key={`${sellerGroups[0].sellerId}-${item.id}`}
                          card={item}
                          displayQuantity={quantities[item.id] || 1}
                          serverQuantity={item.quantity}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.groupsList}>
                      {sellerGroups.map((group) => (
                        <article
                          key={group.sellerId}
                          className={styles.sellerGroup}
                        >
                          <div className={styles.sellerGroupHeader}>
                            <div className={styles.sellerGroupInfo}>
                              <p className={styles.sellerGroupEyebrow}>
                                Separate order
                              </p>
                              {group.sellerId.startsWith('local-') ? (
                                <h3 className={styles.sellerGroupTitle}>
                                  {group.sellerCompany}
                                </h3>
                              ) : (
                                <Link
                                  to={`/sellerProducts/${group.sellerId}`}
                                  className={styles.sellerGroupTitleLink}
                                >
                                  <h3 className={styles.sellerGroupTitle}>
                                    {group.sellerCompany}
                                  </h3>
                                </Link>
                              )}
                              <p className={styles.sellerGroupMeta}>
                                {group.uniqueItems} goods
                              </p>
                            </div>
                            <div className={styles.sellerGroupSummary}>
                              <div className={styles.sellerGroupSummaryCard}>
                                <div className={styles.sellerSummaryRow}>
                                  <span>Subtotal</span>
                                  <strong>${group.subtotal.toFixed(2)}</strong>
                                </div>
                                <div className={styles.sellerSummaryRow}>
                                  <span>Tax</span>
                                  <strong>${group.totalTax.toFixed(2)}</strong>
                                </div>
                                <div className={styles.sellerSummaryRow}>
                                  <span>Total</span>
                                  <strong>${group.total.toFixed(2)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.groupItems}>
                            {group.items.map((item) => (
                              <CartProduct
                                key={`${group.sellerId}-${item.id}`}
                                card={item}
                                displayQuantity={quantities[item.id] || 1}
                                serverQuantity={item.quantity}
                              />
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
                <aside className={styles.aside}>
                  <div className={styles.subtitle}>
                    <SubHeading>Total</SubHeading>
                  </div>
                  <div className={styles.totalPrice}>
                    <div className={styles.summaryBlock}>
                      <div className={styles.totalInfo}>
                        <p>Sub-Total:</p>
                        <span className={styles.price}>
                          ${subTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.summaryBlock}>
                      <div className={styles.totalInfo}>
                        <p>Total items:</p>
                        <span className={styles.price}>{totalItems}</span>
                      </div>
                      <div className={styles.totalInfo}>
                        <p>Total weight:</p>
                        <span className={styles.price}>
                          {formatCartWeight(totalWeight)} kg
                        </span>
                      </div>
                      <div className={styles.totalInfo}>
                        <p>Shipping fee:</p>
                        <span className={styles.mutedValue}>
                          Billed separately
                        </span>
                      </div>
                    </div>
                    <div
                      className={`${styles.summaryBlock} ${styles.totalBlock}`}
                    >
                      <div className={styles.totalInfo}>
                        <p>Total tax:</p>
                        <span className={styles.price}>${dph.toFixed(2)}</span>
                      </div>
                      <div className={styles.totalInfo}>
                        <p className={styles.totalLabel}>Total:</p>
                        <span className={styles.greenPrice}>
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {isAuthenticated ? (
                      <div className={styles.checkoutButton}>
                        <Button onClick={handleCheckout} icon={<CartIcon />}>
                          Checkout
                        </Button>
                      </div>
                    ) : (
                      <div className={styles.guestCheckout}>
                        <div className={styles.guestNotice}>
                          <LockIcon />
                          <div>
                            <p className={styles.guestNoticeTitle}>
                              Log in to place an order
                            </p>
                            <p className={styles.guestNoticeText}>
                              Orders are available to registered companies.
                            </p>
                          </div>
                        </div>
                        <Button onClick={handleCheckout} icon={<LoginIcon />}>
                          Log in to checkout
                        </Button>
                      </div>
                    )}
                    <Link to='/products'>
                      <Button variant='secondary'>Continue Shopping</Button>
                    </Link>
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <>
              <div className={styles.emptyCartHeading}>
                <HeadingH3>Cart</HeadingH3>
                <Link to='/products'>
                  <Button>Go to catalog</Button>
                </Link>
              </div>
              <Space height='32px' />
              <div className={styles.emptyCart}>
                <EmptyCartIcon />
                <h3 className={styles.emptyCartHeading}>Your Cart is Empty</h3>
                <Space height='16px' />
                <p>
                  But that’s easy to fix — just add products from our
                  assortment.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Cart;
