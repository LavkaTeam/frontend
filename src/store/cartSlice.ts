import type { Product } from '@/types/productCard';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem extends Product {
  quantity: number;
}

type CartState = CartItem[];

const initialState: CartState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      if (action.payload.quantity <= 0) {
        return;
      }

      const existingItem = state.find((item) => item.id === action.payload.id);
      const minQty = action.payload.minimumOrderQuantity || 1;
      if (!existingItem) {
        state.push({
          ...action.payload,
          quantity: Math.min(minQty, action.payload.quantity),
        });
      } else {
        existingItem.quantity += 1;
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
