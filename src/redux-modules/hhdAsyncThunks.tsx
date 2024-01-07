import { createAsyncThunk } from "@reduxjs/toolkit";
import { set } from "lodash";
import { getToken, getUrl } from "../local";

const fetchFn = async (url: string, options?: { [s: string]: any }) => {
  const authHeaders = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (!options) {
    options = {
      method: "GET",
    };
  }

  options.headers = { ...options?.headers, ...authHeaders };

  return fetch(`${getUrl()}/api/v1/${url}`, options)
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

export const updateHhdState = createAsyncThunk(
  "hhd/updateHhdState",
  async ({ path, value }: { path: string; value: any }, thunkApi) => {
    const body = set({}, path, value);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const response = await fetchFn("state", options);

    return response;
  }
);
