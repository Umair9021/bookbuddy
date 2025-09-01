import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import bookReducer from "./slices/bookSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    books: bookReducer,
    ui: uiReducer,
  },
});
