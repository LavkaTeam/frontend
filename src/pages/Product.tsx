import { useParams } from 'react-router';

import { productData } from '@/data/productData';

const Product = () => {
  const { productId } = useParams();

  const product = productData.find((item) => item.id === productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <div>{product.price}</div>;
};
export default Product;
