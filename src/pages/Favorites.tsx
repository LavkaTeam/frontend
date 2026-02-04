import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { productData } from '@/data/productData';
import { Space } from '@/components/ui/Space';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { useAppSelector } from '@/store/hooks';
import { EmptyFavoritesIcon } from '@/components/ui/icons/EmptyFavoritesIcon';
import { Button } from '@/components/ui/Button';

import styles from './Favorites.module.css';
import { HeaderMenu } from '@/components/HeaderMenu';

const Favorites = () => {
  const favoriteIds = useAppSelector((state: any) => state.favorites);

  const favoriteProducts = useMemo(() => {
    return productData.filter((product) => favoriteIds.includes(product.id));
  }, [favoriteIds]);

  return (
    <>
      <HeaderMenu />
      <main className='container'>
        <div className={styles.favoritesWrapper}>
          <div className={styles.favoritesHeading}>
            <HeadingH3>Wishlist</HeadingH3>
            <Link to='/products'>
              <Button>Browse catalog</Button>
            </Link>
          </div>
          <Space height='32px' />
          {favoriteProducts.length > 0 ? (
            <CardSection
              cards={favoriteProducts}
              CardComponent={CardProduct}
              noPaddings={true}
            />
          ) : (
            <div className={styles.emptyFavorites}>
              <EmptyFavoritesIcon />
              <h3>Your Wishlist is Empty</h3>
              <Space height='16px' />
              <p>Just add products from our assortment to your wishlist.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Favorites;
