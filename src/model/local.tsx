import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LocalState {
  url: string;
  token: string;
  filter: "advanced" | "expert";
}

const initialState = {
  url: "http://localhost:5335",
  token: "",
  filter: "advanced",
} as LocalState;

export const local = createSlice({
  name: "local",
  initialState: initialState,
  reducers: {
    setToken: (store, action: PayloadAction<string>) => {
      store.token = action.payload;
    },
    setUrl: (store, action: PayloadAction<string | null>) => {
      if (!action.payload) store.url = initialState.url;
      else store.url = action.payload;
    },
    setFilter: (store, action: PayloadAction<"advanced" | "expert">) => {
      store.filter = action.payload;
    },
  },
  selectors: {
    selectToken: (store) => store.token,
    selectUrl: (store) => store.url,
    selectFilter: (store) => store.filter,
    selectIsLocal: (store) => store.url.includes("localhost"),
    selectCanLogin: (store) => store.url && store.token,
  },
});

export default local;
