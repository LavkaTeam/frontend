import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Тип стану - просто масив рядків (ID товарів)
type FavoritesState = string[];

// Функція для завантаження з localStorage
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
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.indexOf(productId);

      if (index !== -1) {
        state.splice(index, 1);
      } else {
        state.push(productId);
      }

      // Зберігаємо в localStorage при кожній зміні
      localStorage.setItem('favorites', JSON.stringify(state));
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
