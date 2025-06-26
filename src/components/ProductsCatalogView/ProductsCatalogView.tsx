import styles from './ProductsCatalogView.module.css';
import { FilterBlock } from '../Filters/FilterBlock';
import { CardSection } from "@/components/CardSection";
import { CardProduct } from '@/components/CardProduct';
import { productData } from '@/data/productData';
import { Pagination } from '@/components/Pagination';

const ProductsCatalogView = () => {
  return (
   <div className={styles.container} >
      <FilterBlock />
      <div className={styles.ProductsLis}>
        <CardSection
          title={false}
          cards={productData}
          CardComponent={CardProduct}
          noPaddings={true}
        />
        <Pagination 
          noPaddings={true}
        />
      </div>
   </div>
  );
};

export { ProductsCatalogView };