import { useParams } from 'react-router';

const Product = () => {
  const { productId } = useParams();

  return <div>{productId}</div>;
};
export default Product;
