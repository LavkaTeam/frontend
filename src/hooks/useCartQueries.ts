import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCartAPI,
} from '@/api/cart';
import type {
  CartItemRequestDto,
  CartUpdateRequestDto,
  CartResponseDto,
  CartItemDto,
} from '@/types/cart';

const cartQueryKey = ['cart'] as const;

const buildCartSummary = (
  items: CartItemDto[],
  previousSummary?: CartResponseDto['summary'],
): CartResponseDto['summary'] => {
  const subtotal = items.reduce((sum, item) => {
    const unitPrice =
      item.appliedPrice ??
      (item.totalPrice && item.requestedQuantity > 0
        ? item.totalPrice / item.requestedQuantity
        : 0);

    return sum + unitPrice * item.requestedQuantity;
  }, 0);

  const totalTax = items.reduce((sum, item) => {
    const unitPrice =
      item.appliedPrice ??
      (item.totalPrice && item.requestedQuantity > 0
        ? item.totalPrice / item.requestedQuantity
        : 0);
    const rawTaxRate = item.taxRate ?? 0;
    const taxRate = rawTaxRate > 1 ? rawTaxRate / 100 : rawTaxRate;

    return sum + unitPrice * item.requestedQuantity * taxRate;
  }, 0);

  return {
    totalItems: items.reduce((sum, item) => sum + item.requestedQuantity, 0),
    totalWeight: previousSummary?.totalWeight ?? 0,
    subtotal,
    totalTax,
    grandTotal: subtotal + totalTax,
  };
};

const buildCartState = (
  previousCart: CartResponseDto,
  items: CartItemDto[],
): CartResponseDto => {
  return {
    ...previousCart,
    items,
    summary: buildCartSummary(items, previousCart.summary),
  };
};

export const useGetCart = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CartItemRequestDto) => addCartItem(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previousCart = queryClient.getQueryData<CartResponseDto>(cartQueryKey);

      queryClient.setQueryData<CartResponseDto>(cartQueryKey, (old) => {
        if (!old) return old;

        const existingItemIndex = old.items.findIndex(
          (item) => item.productId === variables.productId,
        );

        const newItems = [...old.items];
        if (existingItemIndex > -1) {
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            requestedQuantity:
              newItems[existingItemIndex].requestedQuantity +
              variables.requestedQuantity,
          };
        } else {
          const newItem: CartItemDto = {
            productId: variables.productId,
            requestedQuantity: variables.requestedQuantity,
          };
          newItems.push(newItem);
        }

        return buildCartState(old, newItems);
      });

      return { previousCart };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueryKey, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: CartUpdateRequestDto;
    }) => updateCartItemQuantity(productId, data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previousCart = queryClient.getQueryData<CartResponseDto>(cartQueryKey);

      return { previousCart };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueryKey, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previousCart = queryClient.getQueryData<CartResponseDto>(cartQueryKey);

      queryClient.setQueryData<CartResponseDto>(cartQueryKey, (old) => {
        if (!old) return old;

        const newItems = old.items.filter((item) => item.productId !== productId);

        return buildCartState(old, newItems);
      });

      return { previousCart };
    },
    onError: (_error, _productId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueryKey, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCartAPI(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previousCart = queryClient.getQueryData<CartResponseDto>(cartQueryKey);

      queryClient.setQueryData<CartResponseDto>(cartQueryKey, (old) => {
        if (!old) return old;

        return buildCartState(old, []);
      });

      return { previousCart };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueryKey, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};
