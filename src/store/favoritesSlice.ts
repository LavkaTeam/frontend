import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/productCard';

type FavoritesState = Product['id'][];

const loadFromLocalStorage = (): FavoritesState => {
  try {
    const serializedState = localStorage.getItem('favorites');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load favorites from localStorage', e);
    return [];
  }
};

const initialState: FavoritesState = loadFromLocalStorage();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product['id']>) => {
      const productId = action.payload;
      const index = state.indexOf(productId);

      if (index !== -1) {
        state.splice(index, 1);
      } else {
        state.push(productId);
      }

      localStorage.setItem('favorites', JSON.stringify(state));
    },
    clearFavorites: (state) => {
      state.splice(0, state.length);
      localStorage.setItem('favorites', JSON.stringify(state));
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
