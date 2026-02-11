import { Link } from 'react-router-dom';
import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { useAppDispatch } from '@/store/hooks';
import { EmptyFavoritesIcon } from '@/components/ui/icons/EmptyFavoritesIcon';
import { Button } from '@/components/ui/Button';
import { useFavoriteProducts } from '@/hooks/useFavoriteProducts';
import { Loader } from '@/components/ui/Loader';
import { TrashIcon } from '@/components/ui/icons/TrashIcon';
import { clearFavorites } from '@/store/favoritesSlice';
import { Space } from '@/components/ui/Space';
import { HeaderMenu } from '@/components/HeaderMenu';

import styles from './Favorites.module.css';

const Favorites = () => {
  const dispatch = useAppDispatch();
  const { products: favoriteProducts, isLoading } = useFavoriteProducts();

  return (
    <>
      <HeaderMenu />
      <main className='container'>
        <div className={styles.favoritesWrapper}>
          <div className={styles.favoritesHeading}>
            <HeadingH3>Wishlist</HeadingH3>

            {!isLoading && favoriteProducts.length > 0 ? (
              <button
                onClick={() => dispatch(clearFavorites())}
                className={styles.clearButton}
                title='Clear wishlist'
              >
                <TrashIcon
                  width='44'
                  height='44'
                  color='var(--color-brand-dark-burgundy)'
                />
              </button>
            ) : (
              <Link to='/products'>
                <Button>Browse catalog</Button>
              </Link>
            )}
          </div>

          <Space height='32px' />

          {isLoading ? (
            <div className={styles.loaderContainer}>
              <Loader variant='section' />
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
