import { useParams } from 'react-router';

export const Product = () => {
  const { productId } = useParams();

  return <div>{productId}</div>;
};
