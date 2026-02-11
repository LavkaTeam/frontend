import { useFavoriteProducts } from '@/hooks/useFavoriteProducts';
import { CardSection } from '@/components/CardSection/CardSection';
import { CardProduct } from '@/components/CardProduct/CardProduct';
import { Space } from '@/components/ui/Space';
import { HeadingH3 } from '@/components/ui/HeadingH3';
import { EmptyFavoritesIcon } from '@/components/ui/icons/EmptyFavoritesIcon';
import { Loader } from '@/components/ui/Loader';

import styles from './BuyerFavorites.module.css';

const BuyerFavorites = () => {
  const { products: favoriteProducts, isLoading } = useFavoriteProducts();

  return (
    <div className={styles.FavoritesWrapper}>
      <div>
        <HeadingH3>Favorites</HeadingH3>
        <Space height='32px' />
      </div>

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
        <>
          <Space height='32px' />
          <div className={styles.EmptyFavorites}>
            <EmptyFavoritesIcon />
            <Space height='16px' />
            <p>You haven't added any products to favorites yet.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerFavorites;
