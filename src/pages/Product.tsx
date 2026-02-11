import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToHistory } from '@/store/viewingHistorySlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import {
  addItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemQuantity,
} from '@/store/cartSlice';
import { useProduct } from '@/hooks/useProduct';
import { useSearchProducts } from '@/hooks/useSearchProducts';

import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { Price } from '@/components/Price';
import { SubHeading } from '@/components/ui/SubHeading';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from '@/components/ShoppingCart';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';
import { OutlineHeart, SolidHeart } from '@/components/ui/icons/Heart';
import { ProductGallery } from '@/components/ProductGallery';
import { Loader } from '@/components/ui/Loader';
import { ArrowButton } from '@/components/ui/icons/ArrowButton';
import NotFound from './NotFound';

import styles from './Product.module.css';

const Product = () => {
  const dispatch = useAppDispatch();
  const { productId } = useParams();

  const { product, isLoading, error } = useProduct(productId);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const cartItem = useAppSelector((state: any) =>
    state.cart.find((item: any) => item.id === productId),
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isFavorite = useAppSelector((state: any) =>
    productId ? state.favorites.includes(productId) : false,
  );

  const { products: relatedProducts, isLoading: isRelatedLoading } =
    useSearchProducts({
      category: product?.category,
      status: 'in stock',
      size: 12,
      sort: ['quantity,desc'],
    });

  useEffect(() => {
    if (productId && product) {
      dispatch(addToHistory(productId));
    }
  }, [productId, product, dispatch]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) return;
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > product.quantity) val = product.quantity;
    dispatch(updateItemQuantity({ id: product.id, quantity: val }));
  };

  const handleCloseDescription = () => {
    setIsDescriptionOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product) {
    return <NotFound />;
  }

  const isMaxQuantityReached = quantityInCart >= product.quantity;

  return (
    <main className='container'>
      <div
        className={`${styles.drawerOverlay} ${
          isDescriptionOpen ? styles.open : ''
        }`}
        onClick={handleCloseDescription}
      />
      <div
        className={`${styles.drawer} ${isDescriptionOpen ? styles.open : ''}`}
      >
        <div className={styles.drawerHeader}>
          <HeadingH3>Product Description</HeadingH3>
          <button
            className={styles.closeDrawerBtn}
            onClick={handleCloseDescription}
          >
            ×
          </button>
        </div>
        <div className={styles.drawerContent}>{product.description}</div>
      </div>

      <div className={styles.productPage}>
        <div className={styles.imageBlock}>
          <ProductGallery
            mainImage={product.mainImage}
            additionalImages={product.images}
            altText={product.name}
          />
        </div>

        <div className={styles.contentBlock}>
          <HeadingH3>{product.name}</HeadingH3>
          <Space height='32px' />

          <div className={styles.inStockInfo}>
            {product.quantity > 0 ? (
              <>
                <span className={styles.spanInStock}></span>
                <p className={styles.inStock}>In Stock</p>
              </>
            ) : (
              <>
                <span className={styles.spanSoldOut}></span>
                <p className={styles.soldOut}>Sold Out</p>
              </>
            )}
          </div>

          <Space height='16px' />
          <Price price={product.price} />
          <Space height='16px' />
          <SubHeading color='secondary'>
            SKU: {product.id.slice(0, 8) || 'N/A'}
          </SubHeading>
          <Space height='16px' />

          <div className={styles.productInfo}>
            <div>
              <SubHeading size='medium' color='primary'>
                Brand:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.producer || 'N/A'}
              </SubHeading>
              <Space height='24px' />
              <SubHeading size='medium' color='primary'>
                Alcohol:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.alcohol || product.alcohol >= 0
                  ? `${product.alcohol}%`
                  : 'N/A'}
              </SubHeading>
            </div>
            <div className={styles.divider}></div>
            <div>
              <SubHeading size='medium' color='primary'>
                Country:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.country || 'N/A'}
              </SubHeading>
              <Space height='24px' />
              <SubHeading size='medium' color='primary'>
                Volume:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.volume ? `${product.volume} L` : 'N/A'}
              </SubHeading>
            </div>
          </div>

          <Space height='20px' />

          <div>
            <h6 className={styles.h6}>Product Description</h6>
            <div className={styles.descriptionWrapper}>
              <p className={styles.descriptionText}>
                {product.description || 'No description available.'}
              </p>

              {product.description.length > 270 && (
                <button
                  className={styles.readMoreBtn}
                  onClick={() => setIsDescriptionOpen(true)}
                >
                  Read more
                </button>
              )}
            </div>
          </div>

          <Space height='40px' />

          <div className={styles.actions}>
            <div className={styles.actionButton}>
              {quantityInCart === 0 ? (
                <Button
                  onClick={() => dispatch(addItem(product))}
                  icon={<ShoppingCart />}
                  disabled={product.quantity <= 0}
                >
                  Add to cart
                </Button>
              ) : (
                <div className={styles.addedStateWrapper}>
                  <div className={styles.counterRow}>
                    <span className={styles.unitPrice}>
                      ${product.price.toFixed(2)}
                    </span>

                    <div className={styles.quantityWrapper}>
                      <div className={styles.quantityBlock}>
                        <button
                          onClick={() =>
                            dispatch(decreaseQuantity({ id: product.id }))
                          }
                          className={styles.quantityBtn}
                        >
                          -
                        </button>

                        <input
                          type='number'
                          className={styles.quantityInput}
                          value={quantityInCart}
                          onChange={handleQuantityChange}
                          min='1'
                          max={product.quantity}
                        />

                        <button
                          onClick={() =>
                            dispatch(increaseQuantity({ id: product.id }))
                          }
                          className={styles.quantityBtn}
                          disabled={isMaxQuantityReached}
                        >
                          +
                        </button>
                      </div>

                      {isMaxQuantityReached && (
                        <span className={styles.stockMessage}>
                          Max available: {product.quantity}
                        </span>
                      )}
                    </div>

                    <span className={styles.totalPrice}>
                      ${(product.price * quantityInCart).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              className={styles.favoritesBlock}
              onClick={() => dispatch(toggleFavorite(product.id))}
            >
              {isFavorite ? <SolidHeart /> : <OutlineHeart />}
              <span className={styles.favorites}>Favorites</span>
            </div>
          </div>

          <Space height='32px' />
          <div className={styles.border}></div>
          <Space height='26px' />

          <h6 className={styles.h6}>Seller of the product</h6>
          <Space height='28px' />

          <div className={styles.contactItem}>
            <SubHeading size='medium' color='primary'>
              Company Name:
            </SubHeading>
            <SubHeading size='medium' color='secondary'>
              {product.seller.company || 'N/A'}
            </SubHeading>
          </div>

          <div className={styles.contactItem}>
            <SubHeading size='medium' color='primary'>
              Phone:
            </SubHeading>
            <a
              href={`tel:${product.seller.phone}`}
              className={styles.contactLink}
            >
              {product.seller.phone || 'N/A'}
            </a>
          </div>

          <div className={styles.sellerRow}>
            <div className={styles.contactItem}>
              <SubHeading size='medium' color='primary'>
                Email:
              </SubHeading>
              <a
                href={`mailto:${product.seller.email}`}
                className={styles.contactLink}
              >
                {product.seller.email || 'N/A'}
              </a>
            </div>
            <Link
              to={`/sellerProducts/${product.seller.id}`}
              className={styles.sellerLinkWrapper}
            >
              <span className={styles.sellerLinkText}>
                View all seller's products
              </span>
              <div className={styles.sellerArrow}>
                <ArrowButton direction='right' variant='minimal' />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Space height='85px' />

      <div>
        <HeadingH3>Related products</HeadingH3>
        <Space height='32px' />
        <div className={styles.relatedSectionWrapper}>
          {isRelatedLoading ? (
            <Loader variant='section' />
          ) : (
            <CardSection
              cards={relatedProducts || []}
              CardComponent={CardProduct}
              withSlider={relatedProducts && relatedProducts.length > 4}
              noPaddings
            />
          )}
        </div>
      </div>
    </main>
  );
};
export default Product;
