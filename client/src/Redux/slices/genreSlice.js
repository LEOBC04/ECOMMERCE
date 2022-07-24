import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genres: [],
};

const genreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    getGenres(state, action) {
      state.genres = [...action.payload];
    },
  },
});


export const { getGenres } = genreSlice.actions;

export default genreSlice.reducer;