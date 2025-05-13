import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import bookReducer from './slices/bookSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    books: bookReducer,
  },
});

// Remove TypeScript-only types, so nothing to export for RootState or AppDispatch in JS
