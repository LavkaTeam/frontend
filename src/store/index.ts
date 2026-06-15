import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import favoritesReducer from './favoritesSlice';
import viewingHistoryReducer from './viewingHistorySlice';
import searchHistoryReducer from './searchHistorySlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    viewingHistory: viewingHistoryReducer,
    searchHistory: searchHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
