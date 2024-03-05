import { configureStore } from "@reduxjs/toolkit";
import hhdSlice from "./slice";

export const store = configureStore({
  reducer: {
    hhd: hhdSlice.reducer,
  },
  devTools: true,
  //   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
