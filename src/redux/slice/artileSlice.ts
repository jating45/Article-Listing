import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchArticles = createAsyncThunk("articles/fetch", async () => {
  const response = await fetch("http://localhost:5000/api/data");
  return await response.json();
});

const articlesSlice = createSlice({
  name: "articles",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const selectFilteredArticles = (state: any) => state.articles.list;
export default articlesSlice.reducer;
