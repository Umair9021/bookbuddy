import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  avatarUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAvatarUrl: (state, action) => {
      state.avatarUrl = action.payload;
    },
  },
});

export const { setUser, setAvatarUrl } = userSlice.actions;

export default userSlice.reducer;