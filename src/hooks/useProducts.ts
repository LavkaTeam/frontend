import { useQuery } from "@tanstack/react-query"
import { getProducts } from "../api/products"


const useProducts = ({page = 1, size = 10}) => {
    const { data: products, isLoading, error} = useQuery({
        queryFn: () => getProducts({page, size}),
        queryKey: ["products", page, size]
    })

    return {products, isLoading, error};
}


export {useProducts};