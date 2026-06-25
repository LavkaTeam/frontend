import type { Product } from '@/types/productCard';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem extends Product {
  quantity: number;
}

type CartState = CartItem[];

const loadCartFromStorage = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch {
    return [];
  }
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) => {
      const { product, quantity } = action.payload;

      if (product.quantity <= 0) {
        return;
      }

      const existingItem = state.find((item) => item.id === product.id);
      const minQty = product.minimumOrderQuantity || 1;
      const requestedQuantity = Math.max(quantity ?? minQty, minQty);

      if (!existingItem) {
        state.push({
          ...product,
          quantity: Math.min(requestedQuantity, product.quantity),
        });
      } else {
        existingItem.quantity = Math.min(
          existingItem.quantity + requestedQuantity,
          product.quantity,
        );
      }
    },

    increaseQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const item = state.find((item) => item.id === action.payload.id);
      const minQty = item?.minimumOrderQuantity || 1;

      if (item && item.quantity > minQty) {
        item.quantity -= 1;
      } else {
        return state.filter((item) => item.id !== action.payload.id);
      }
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.find((item) => item.id === action.payload.id);
      if (item) {
        const minQty = item.minimumOrderQuantity || 1;
        const boundedQty = Math.max(action.payload.quantity, minQty);
        item.quantity = boundedQty;
      }
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
    clearCart: (state) => {
      state.splice(0, state.length);
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  updateItemQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
