import { Link } from 'react-router-dom';
import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct/CardProduct';
import { CardProductSkeleton } from '@/components/CardProduct';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { EmptyFavoritesIcon } from '@/components/ui/icons/EmptyFavoritesIcon';
import { Button } from '@/components/ui/Button';
import { useFavoriteProducts } from '@/hooks/useFavoriteProducts';
import { Space } from '@/components/ui/Space';
import { HeaderMenu } from '@/components/HeaderMenu';

import styles from './Favorites.module.css';

const Favorites = () => {
  const { products: favoriteProducts, isLoading } = useFavoriteProducts();

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

          {isLoading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <CardProductSkeleton key={index} />
              ))}
            </div>
          ) : favoriteProducts.length > 0 ? (
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
