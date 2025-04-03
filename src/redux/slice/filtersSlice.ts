import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  category: string;
  author: string;
  date: string;
}

const initialState: FiltersState = {
  category: "All",
  author: "All",
  date: "All",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setAuthor: (state, action: PayloadAction<string>) => {
      state.author = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    resetFilters: (state) => {
      state.category = "All";
      state.author = "All";
      state.date = "All";
    },
  },
});

export const { setCategory, setAuthor, setDate, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
