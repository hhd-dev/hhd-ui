import { createAsyncThunk } from "@reduxjs/toolkit";
import { set } from "lodash";

const fetchFn = async (url: string, options?: { [s: string]: any }) => {
  const authHeaders = {
    Authorization: `Bearer ${window.localStorage.getItem("hhdToken")}`,
  };
  if (!options) {
    options = {
      method: "GET",
    };
  }

  options.headers = { ...options?.headers, ...authHeaders };

  return fetch(`http://localhost:5335/api/v1/${url}`, options)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
    })
    .catch(console.log);
};

export const fetchHhdSettings = createAsyncThunk(
  "hhd/fetchHhdSettings",
  async () => {
    const response = await fetchFn("settings");
    return response;
  }
);

export const fetchHhdSettingsState = createAsyncThunk(
  "hhd/fetchHhdSettingsState",
  async () => {
    const response = await fetchFn("state");

    return response;
  }
);

export const updateControllerSettingsState = createAsyncThunk(
  "hhd/updateControllerSettingsState",
  async ({ path, value }: { path: string; value: any }, thunkApi) => {
    const body = set({}, `controllers.legion_go.${path}`, value);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const response = await fetchFn("state", options);

    return response;
  }
);
