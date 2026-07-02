import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchHistoryState {
  items: string[];
}

const HISTORY_LIMIT = 10;
const STORAGE_KEY = 'lavka-search-history';

const loadFromLocalStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load search history from localStorage', e);
    return [];
  }
};

const initialState: SearchHistoryState = {
  items: loadFromLocalStorage(),
};

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState,
  reducers: {
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;

      // Remove existing to put it at the top
      state.items = [
        query,
        ...state.items.filter((item) => item.toLowerCase() !== query.toLowerCase()),
      ].slice(0, HISTORY_LIMIT);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    removeFromSearchHistory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    },
    clearSearchHistory: (state) => {
      state.items = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { addToSearchHistory, removeFromSearchHistory, clearSearchHistory } =
  searchHistorySlice.actions;
export default searchHistorySlice.reducer;
