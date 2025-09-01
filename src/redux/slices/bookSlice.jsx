import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  filteredBooks: [],
  selectedBook: null,
  bookForm: {
    title: "",
    price: "",
    description: "",
    condition: "New",
    department: "First Year",
    status: "Available",
    images: [],
    thumbnailIndex: 0,
  },
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
      state.filteredBooks = action.payload;
    },
    filterBooks: (state, action) => {
      const query = action.payload.toLowerCase();
      state.filteredBooks = state.books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.department.toLowerCase().includes(query)
      );
    },
    setBookForm: (state, action) => {
      state.bookForm = { ...state.bookForm, ...action.payload };
    },
    resetBookForm: (state) => {
      state.bookForm = initialState.bookForm;
    },
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
  },
});

export const {
  setBooks,
  filterBooks,
  setBookForm,
  resetBookForm,
  setSelectedBook,
} = bookSlice.actions;

export default bookSlice.reducer;
