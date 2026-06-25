import { useEffect, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addItem as addReduxItem,
  removeItem as removeReduxItem,
  updateItemQuantity as updateReduxQuantity,
  clearCart as clearReduxCart,
} from '@/store/cartSlice';
import {
  useAddCartItem,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
  useClearCart,
  useGetCart,
} from './useCartQueries';
import { useToast } from './useToast';
import type { Product } from '@/types/productCard';

type CartActionError = {
  message?: string;
};

const cartQueryKey = ['cart'] as const;
const cartQuantityDebounceMs = 500;

const quantitySyncTimers = new Map<string, number>();
const pendingQuantitySyncs = new Map<string, number>();
const optimisticQuantities = new Map<string, number>();
const syncingProductIds = new Set<string>();
const syncListeners = new Set<() => void>();
let syncStateVersion = 0;

const notifySyncListeners = () => {
  syncStateVersion += 1;
  syncListeners.forEach((listener) => listener());
};

const subscribeToSyncState = (listener: () => void) => {
  syncListeners.add(listener);

  return () => {
    syncListeners.delete(listener);
  };
};

const getSyncSnapshot = () => syncStateVersion;

const clearPendingQuantityTimer = (productId: string) => {
  const timerId = quantitySyncTimers.get(productId);

  if (timerId !== undefined) {
    window.clearTimeout(timerId);
    quantitySyncTimers.delete(productId);
  }
};

export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  useSyncExternalStore(subscribeToSyncState, getSyncSnapshot);

  const localCartItems = useAppSelector((state) => state.cart);
  const { data: remoteCart } = useGetCart(isAuthenticated);

  const { showToast } = useToast();

  const addMutation = useAddCartItem();
  const updateMutation = useUpdateCartItemQuantity();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();

  useEffect(() => {
    if (!isAuthenticated || !remoteCart?.items) {
      return;
    }

    let hasChanges = false;

    remoteCart.items.forEach((item) => {
      const optimisticQuantity = optimisticQuantities.get(item.productId);

      if (
        optimisticQuantity !== undefined &&
        optimisticQuantity === item.requestedQuantity
      ) {
        optimisticQuantities.delete(item.productId);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      notifySyncListeners();
    }
  }, [isAuthenticated, remoteCart]);

  const handleActionError = (error: unknown) => {
    const errorMessage =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as CartActionError).message === 'string'
        ? (error as CartActionError).message
        : undefined;

    const message = errorMessage ?? 'An error occurred with your cart action.';

    showToast(message, 'error');
  };

  const addItem = async (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      try {
        await addMutation.mutateAsync({
          productId: product.id,
          requestedQuantity: quantity,
        });
      } catch (error) {
        handleActionError(error);
      }
    } else {
      dispatch(addReduxItem({ product, quantity }));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      optimisticQuantities.set(productId, quantity);
      notifySyncListeners();
      pendingQuantitySyncs.set(productId, quantity);
      clearPendingQuantityTimer(productId);

      const flushQuantityUpdate = async () => {
        if (syncingProductIds.has(productId)) {
          return;
        }

        const nextQuantity = pendingQuantitySyncs.get(productId);
        if (nextQuantity === undefined) {
          return;
        }

        pendingQuantitySyncs.delete(productId);
        syncingProductIds.add(productId);
        notifySyncListeners();

        try {
          await updateMutation.mutateAsync({
            productId,
            data: { requestedQuantity: nextQuantity },
          });
        } catch (error) {
          optimisticQuantities.delete(productId);
          notifySyncListeners();
          handleActionError(error);
          queryClient.invalidateQueries({ queryKey: cartQueryKey });
        } finally {
          syncingProductIds.delete(productId);
          notifySyncListeners();

          if (pendingQuantitySyncs.has(productId)) {
            void flushQuantityUpdate();
          }
        }
      };

      quantitySyncTimers.set(
        productId,
        window.setTimeout(() => {
          quantitySyncTimers.delete(productId);
          void flushQuantityUpdate();
        }, cartQuantityDebounceMs),
      );

      return;
    } else {
      dispatch(updateReduxQuantity({ id: productId, quantity }));
    }
  };

  const removeItem = async (productId: string) => {
    clearPendingQuantityTimer(productId);
    pendingQuantitySyncs.delete(productId);
    optimisticQuantities.delete(productId);
    notifySyncListeners();

    if (isAuthenticated) {
      try {
        await removeMutation.mutateAsync(productId);
      } catch (error) {
        handleActionError(error);
      }
    } else {
      dispatch(removeReduxItem({ id: productId }));
    }
  };

  const clearCart = async () => {
    quantitySyncTimers.forEach((timerId) => window.clearTimeout(timerId));
    quantitySyncTimers.clear();
    pendingQuantitySyncs.clear();
    optimisticQuantities.clear();
    syncingProductIds.clear();
    notifySyncListeners();

    if (isAuthenticated) {
      try {
        await clearMutation.mutateAsync();
        showToast('Cart cleared', 'success');
      } catch (error) {
        handleActionError(error);
      }
    } else {
      dispatch(clearReduxCart());
      showToast('Local cart cleared', 'success');
    }
  };

  const getCartItemQuantity = (productId: string): number => {
    if (isAuthenticated) {
      const optimisticQuantity = optimisticQuantities.get(productId);

      if (optimisticQuantity !== undefined) {
        return optimisticQuantity;
      }

      const item = remoteCart?.items?.find((i) => i.productId === productId);
      return item ? item.requestedQuantity : 0;
    }
    const item = localCartItems.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const isAddingItem = (productId: string): boolean => {
    return addMutation.isPending && addMutation.variables?.productId === productId;
  };

  const isUpdatingItem = (productId: string): boolean => {
    return syncingProductIds.has(productId);
  };

  const isRemovingItem = (productId: string): boolean => {
    return removeMutation.isPending && removeMutation.variables === productId;
  };

  return {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCartItemQuantity,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
    isAddingItem,
    isUpdatingItem,
    isRemovingItem,
  };
};
