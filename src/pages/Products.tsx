import { HeaderMenu } from "@/components/HeaderMenu";
import { ProductsCatalogView } from '@components/ProductsCatalogView'


const Products = () => {
  return (
    <div className='container'>
      <HeaderMenu />
      <ProductsCatalogView />
    </div>
  );
};

export default Products;
