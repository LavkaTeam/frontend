import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createProduct,
  getCategoryTree,
  getMyProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
} from '@/api/Products';
import type {
  Product,
  ProductRequest,
  ProductStatus,
  SellerProductSummary,
} from '@/types/productCard';

const PRODUCT_STALE_TIME = 60_000;

export const useSellerProducts = (
  page = 0,
  size = 10,
  status?: ProductStatus,
) => {
  const query = useQuery({
    queryKey: ['seller-products', page, size, status],
    queryFn: () => getMyProducts(page, size, status),
    placeholderData: keepPreviousData,
    staleTime: PRODUCT_STALE_TIME,
  });

  return {
    products: (query.data?.content || []) as SellerProductSummary[],
    totalPages: query.data?.totalPages || 0,
    totalElements: query.data?.totalElements || 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
};

export const useSellerProduct = (productId?: string) => {
  return useQuery<Product>({
    queryKey: ['seller-product', productId],
    queryFn: () => getProductById(productId as string),
    enabled: Boolean(productId),
    staleTime: PRODUCT_STALE_TIME,
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['product-categories-tree'],
    queryFn: getCategoryTree,
    staleTime: 5 * 60_000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductRequest) => createProduct(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['seller-products'],
      });
    },
  });
};

export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductRequest) => updateProduct(productId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['seller-products'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['seller-product', productId],
        }),
      ]);
    },
  });
};

export const useUpdateSellerProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: string;
      status: ProductStatus;
    }) => updateProductStatus(productId, status),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['seller-products'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['seller-product', variables.productId],
        }),
      ]);
    },
  });
};
