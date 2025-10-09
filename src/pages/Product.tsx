import { useParams } from 'react-router';
import { productData } from '@/data/productData';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { Space } from '@/components/ui/Space';
import { Price } from '@/components/Price';
import { SubHeading } from '@/components/ui/SubHeading';

import styles from './Product.module.css';

const Product = () => {
  const { productId } = useParams();

  const product = productData.find((item) => item.id === productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className='container'>
      <Space height='32px' />
      <div className={styles.productPage}>
        <div className={styles.imageBlock}>product images</div>
        <div>
          <HeadingH3>
            {product.title} {product.capacity} L {product.brand}
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
          <div className={styles.productInfo}>
            <div>
              <SubHeading size='medium' color='primary'>
                Brand:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.brand}
              </SubHeading>
              <Space height='32px' />
              <SubHeading size='medium' color='primary'>
                Alcohol:
              </SubHeading>
              <SubHeading size='medium' color='secondary'>
                {product.brand}
              </SubHeading>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Product;
