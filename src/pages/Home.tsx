import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/products";

const Home = () => {

  const {products, isLoading} = useProducts({page: 0, size: 10})
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {products?.content.map((product : Product) => {
        return <div>{product.name}</div>
      })}
    </>
  )};

export { Home };
