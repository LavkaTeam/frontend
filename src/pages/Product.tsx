import { useParams } from 'react-router';
import { productData } from '@/data/productData';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { Price } from '@/components/Price';
import { SubHeading } from '@/components/ui/SubHeading';
import { Button } from '@/components/ui/Button';
import { ShoppingCart } from '@/components/ShoppingCart';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/cartSlice';
import { CardSection } from '@/components/CardSection';
import { CardProduct } from '@/components/CardProduct';

import styles from './Product.module.css';

const Product = () => {
  const dispatch = useAppDispatch();

  const { productId } = useParams();

  const product = productData.find((item) => item.id === productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className='container'>
      <div className={styles.productPage}>
        <div className={styles.imageBlock}>product images</div>
        <div>
          <HeadingH3>
            {product.title} {product.capacity} L {product.title}
          </HeadingH3>
          <Space height='32px' />
          <div className={styles.inStockInfo}>
            {product.inStock ? (
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
          <SubHeading color='secondary'>{product.sku}</SubHeading>
          <Space height='24px' />
          <div className={styles.productInfo}>
            <div>
              <SubHeading size='medium' color='primary'>
                Brand:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.title}
              </SubHeading>
              <Space height='32px' />
              <SubHeading size='medium' color='primary'>
                Alcohol:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.abv}
              </SubHeading>
            </div>
            <span></span>
            <div>
              <SubHeading size='medium' color='primary'>
                Country:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.country}
              </SubHeading>
              <Space height='32px' />
              <SubHeading size='medium' color='primary'>
                Amount of:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.capacity} L
              </SubHeading>
            </div>
          </div>
          <Space height='24px' />
          <div>
            <h6 className={styles.h6}>Product Description</h6>
            <SubHeading size='medium' color='secondary'>
              A dry sparkling wine from Spain with a pale straw color and fine
              bubbles. Aromas of green apple, white peach, and floral notes.
              Fresh and balanced taste with a light acidity.
            </SubHeading>
          </div>
          <Space height='40px' />
          <div className={styles.actions}>
            <div className={styles.actionButton}>
              <Button
                onClick={() => dispatch(addItem(product))}
                icon={<ShoppingCart />}
              >
                Add to cart
              </Button>
            </div>
            <div className={styles.favoritesBlock}>
              <span className={styles.favorites}>Favorites</span>
            </div>
          </div>
          <Space height='32px' />
          <span className={styles.border}></span>
          <Space height='32px' />
          <h6 className={styles.h6}>Seller of the product</h6>
          <Space height='32px' />
          <div className={styles.contactInfo}>
            <SubHeading size='medium' color='primary'>
              Company Name:
            </SubHeading>
            <SubHeading size='medium' color='secondary'>
              Drnk & Co
            </SubHeading>
          </div>
          <div className={styles.contactInfo}>
            <SubHeading size='medium' color='primary'>
              Phone:
            </SubHeading>
            <SubHeading size='medium' color='secondary'>
              <a href='tel:+442071234567'>+44&nbsp;20&nbsp;7123&nbsp;4567</a>
            </SubHeading>
          </div>
          <div className={styles.contactInfo}>
            <SubHeading size='medium' color='primary'>
              Email:
            </SubHeading>
            <SubHeading size='medium' color='secondary'>
              <a href='mailto:sales@velvetspirits.co.uk'>
                sales@velvetspirits.co.uk
              </a>
            </SubHeading>
          </div>
          <Space height='24px' />
        </div>
      </div>
      <Space height='85px' />
      <div>
        <CardSection
          title='Top selections for you'
          cards={productData}
          CardComponent={CardProduct}
          withSlider={true}
          noPaddings={true}
        />
      </div>
    </main>
  );
};
export default Product;
