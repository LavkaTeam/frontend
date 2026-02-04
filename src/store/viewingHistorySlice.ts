import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Зберігаємо тільки ID товарів
type ViewingHistoryState = string[];

const HISTORY_LIMIT = 25; // Максимальна кількість товарів в історії

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
    addToHistory: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // 1. Видаляємо товар, якщо він вже там є (щоб перемістити його наверх)
      const existingIndex = state.indexOf(productId);
      if (existingIndex !== -1) {
        state.splice(existingIndex, 1);
      }

      // 2. Додаємо на початок масиву (Unshift)
      state.unshift(productId);

      // 3. Обрізаємо масив, якщо він більший за ліміт
      if (state.length > HISTORY_LIMIT) {
        state.length = HISTORY_LIMIT;
      }

      // 4. Зберігаємо
      localStorage.setItem('viewingHistory', JSON.stringify(state));
    },

    clearHistory: (state) => {
      state.length = 0; // Очищаємо масив
      localStorage.removeItem('viewingHistory');
    },
  },
});

export const { addToHistory, clearHistory } = viewingHistorySlice.actions;
export default viewingHistorySlice.reducer;
