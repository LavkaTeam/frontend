import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/productCard';

type ViewingHistoryState = Product['id'][];

const HISTORY_LIMIT = 25;

const loadFromLocalStorage = (): ViewingHistoryState => {
  try {
    const serializedState = localStorage.getItem('viewingHistory');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load viewing history from localStorage', e);
    return [];
  }
};

const initialState: ViewingHistoryState = loadFromLocalStorage();

const viewingHistorySlice = createSlice({
  name: 'viewingHistory',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<Product['id']>) => {
      const productId = action.payload;

      const existingIndex = state.indexOf(productId);
      if (existingIndex !== -1) {
        state.splice(existingIndex, 1);
      }

      state.unshift(productId);

      if (state.length > HISTORY_LIMIT) {
        state.length = HISTORY_LIMIT;
      }

      localStorage.setItem('viewingHistory', JSON.stringify(state));
    },

    clearHistory: (state) => {
      state.length = 0;
      localStorage.removeItem('viewingHistory');
    },
  },
});

export const { addToHistory, clearHistory } = viewingHistorySlice.actions;
export default viewingHistorySlice.reducer;
