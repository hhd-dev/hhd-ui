import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import local from "./local";
import hhdSlice from "./slice";

export const { store, persistor } = (() => {
  const persistConfig = {
    key: "root",
    storage,
  };

  const localReducer = persistReducer(persistConfig, local.reducer);

  let store = configureStore({
    reducer: {
      hhd: hhdSlice.reducer,
      local: localReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  let persistor = persistStore(store);

  return { store, persistor };
})();
