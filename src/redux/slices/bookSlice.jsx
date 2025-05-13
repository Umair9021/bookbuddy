import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks(state, action) {
      state.books = action.payload;
    },
    addBook(state, action) {
      state.books.push(action.payload);
    },
  },
});

export const { setBooks, addBook } = bookSlice.actions;
export default bookSlice.reducer;
