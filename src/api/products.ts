import type { ProductsPayload, ProductsResponse } from "../types/products";
import { fetchData } from "./fetchData";

const getProducts = (data: ProductsPayload): Promise<ProductsResponse> => {

    return fetchData<ProductsResponse>(`/products?page=${data.page}&size=${data.size}`, {
        method: 'GET'
    });
}

export {getProducts};