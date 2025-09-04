import type { ProductCard } from '@/types/productCard';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem extends ProductCard {
  quantity: number;
}

type CartState = CartItem[];

const initialState: CartState = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ProductCard>) => {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (!existingItem) {
        state.push({ ...action.payload, quantity: 1 });
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
      if (item && item.quantity > 1) {
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
        item.quantity = action.payload.quantity;
      }
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
