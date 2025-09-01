import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: true,
  mobileMenuOpen: false,
  userDropdownOpen: false,
  activeTab: "overview",
  searchQuery: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setUserDropdownOpen: (state, action) => {
      state.userDropdownOpen = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setActiveTab,
  toggleSidebar,
  toggleMobileMenu,
  setUserDropdownOpen,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer;
