import { Link, useNavigate } from 'react-router-dom';
import { CartProduct, CartProductSkeleton } from '@/components/CartProduct';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { SubHeading } from '@/components/ui/SubHeading';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/Button';
import { CartIcon } from '@/components/ui/icons/CartIcon';
import { Space } from '@/components/ui/Space';
import { EmptyCartIcon } from '@/components/ui/icons/EmptyCartIcon';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { HeaderMenu } from '@/components/HeaderMenu';

import { useCartActions } from '@/hooks/useCartActions';
import { useGetCart } from '@/hooks/useCartQueries';
import type { WholesalePrice } from '@/types/productCard';
import type { ProductImage } from '@/types/productCard';
import { resolvePricing } from '@/utils/pricing';

import styles from './Cart.module.css';

type CartDisplayItem = {
  id: string;
  name: string;
  price: number;
  mainImage?: ProductImage;
  producer: string;
  volume?: number;
  minimumOrderQuantity?: number;
  sku?: string;
  barcode?: string;
  country?: string;
  alcohol?: number;
  stock?: number;
  discountPrice?: number;
  wholesalePrices?: WholesalePrice[];
  sellerId?: string;
  sellerCompany?: string;
  sellerName?: string;
  quantity: number;
  weight?: number;
  taxRate?: number;
};

type SellerCartGroup = {
  sellerId: string;
  sellerCompany: string;
  sellerName?: string;
  items: CartDisplayItem[];
  uniqueItems: number;
  totalItems: number;
  subtotal: number;
  totalWeight: number;
  totalTax: number;
  total: number;
};

const formatWeight = (value: number) => {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0';
};

const normalizeTaxRate = (value?: number) => {
  if (!value) return 0;
  return value > 1 ? value / 100 : value;
};

const getDisplayUnitPrice = (
  item: CartDisplayItem,
  isAuthenticated: boolean,
) => {
  if (isAuthenticated) {
    return item.price;
  }

  return resolvePricing(item, item.quantity).currentUnitPrice;
};

const Cart = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const localCartItems = useAppSelector((state) => state.cart);
  const { data: remoteCart, isLoading } = useGetCart(isAuthenticated);
  const { clearCart, getCartItemQuantity, isClearing } = useCartActions();

  const showSkeletons = (isAuthenticated && isLoading) || isClearing;

  const cartItems = isAuthenticated
    ? (remoteCart?.items || []).map(
        (item): CartDisplayItem => ({
          id: item.productId,
          name: item.name || '',
          price: item.appliedPrice || 0,
          mainImage: item.mainImage
            ? { id: item.productId, url: item.mainImage }
            : undefined,
          producer: item.producer || '',
          volume: item.volume || 0,
          minimumOrderQuantity: item.minimumOrderQuantity || 1,
          sku: item.sku,
          barcode: item.barcode,
          country: item.country,
          alcohol: item.alcohol,
          discountPrice: item.discountPrice,
          wholesalePrices: item.wholesalePrices,
          sellerId: item.sellerId,
          sellerCompany: item.sellerCompany,
          sellerName: item.sellerName,
          quantity: item.requestedQuantity,
          taxRate: item.taxRate,
        }),
      )
    : localCartItems.map((item) => ({
        ...item,
        sellerId: item.seller?.id,
        sellerCompany: item.seller?.companyName,
        sellerName: [item.seller?.firstName, item.seller?.lastName]
          .filter(Boolean)
          .join(' '),
        sku: item.sku,
        barcode: item.barcode,
        country: item.countryOfOrigin,
        alcohol: item.alcohol,
        discountPrice: item.discountPrice,
        wholesalePrices: item.wholesalePrices,
        minimumOrderQuantity: item.minimumOrderQuantity,
      }));

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

  let subTotal = 0;
  let dph = 0;
  let total = 0;
  let totalItems = isAuthenticated
    ? (remoteCart?.summary.totalItems ??
      (remoteCart?.items || []).reduce(
        (sum, item) => sum + item.requestedQuantity,
        0,
      ))
    : localCartItems.reduce((sum, item) => sum + item.quantity, 0);
  let totalWeight = 0;

  const sellerGroups = cartItems.reduce<SellerCartGroup[]>((groups, item) => {
    const unitPrice = getDisplayUnitPrice(item, isAuthenticated);
    const sellerId = item.sellerId || `local-${item.id}`;
    const sellerCompany =
      item.sellerCompany || item.sellerName || 'Independent seller';
    const existingGroup = groups.find((group) => group.sellerId === sellerId);

    if (!existingGroup) {
      groups.push({
        sellerId,
        sellerCompany,
        sellerName: item.sellerName,
        items: [item],
        uniqueItems: 1,
        totalItems: item.quantity,
        subtotal: unitPrice * item.quantity,
        totalWeight: (item.weight || 0) * item.quantity,
        totalTax: unitPrice * item.quantity * normalizeTaxRate(item.taxRate),
        total: unitPrice * item.quantity * (1 + normalizeTaxRate(item.taxRate)),
      });

      return groups;
    }

    existingGroup.items.push(item);
    existingGroup.uniqueItems += 1;
    existingGroup.totalItems += item.quantity;
    existingGroup.subtotal += unitPrice * item.quantity;
    existingGroup.totalWeight += (item.weight || 0) * item.quantity;
    existingGroup.totalTax +=
      unitPrice * item.quantity * normalizeTaxRate(item.taxRate);
    existingGroup.total +=
      unitPrice * item.quantity * (1 + normalizeTaxRate(item.taxRate));

    return groups;
  }, []);

  if (isAuthenticated && remoteCart?.summary) {
    subTotal = remoteCart.summary.subtotal || 0;
    dph = remoteCart.summary.totalTax || subTotal * 0.21;
    total = remoteCart.summary.grandTotal || 0;
    totalItems =
      remoteCart.summary.totalItems ??
      remoteCart.items.reduce((sum, item) => sum + item.requestedQuantity, 0);
    totalWeight = remoteCart.summary.totalWeight || 0;
  } else {
    subTotal = localCartItems.reduce((acc, item) => {
      return acc + resolvePricing(item, item.quantity).currentUnitPrice * item.quantity;
    }, 0);
    dph = subTotal * 0.21;
    total = subTotal + dph;
    totalItems = localCartItems.reduce((sum, item) => sum + item.quantity, 0);
    totalWeight = localCartItems.reduce(
      (sum, item) => sum + (item.weight || 0) * item.quantity,
      0,
    );
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { usr: { from: '/checkout' } } });
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
                          {formatWeight(totalWeight)} kg
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
                    <div className={styles.checkoutButton}>
                      <Button onClick={handleCheckout} icon={<CartIcon />}>
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
