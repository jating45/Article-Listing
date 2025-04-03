// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./slice/artileSlice";
import filterReducer from "./slice/filtersSlice";

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    filters: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

