import { createAsyncThunk } from "@reduxjs/toolkit";
import { set } from "lodash";

export type Credentials = { endpoint: string; token: string };

export const fetchFn = async (
  endpoint: string,
  token: string,
  url: string,
  options?: { [s: string]: any }
) => {
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };
  if (!options) {
    options = {
      method: "GET",
    };
  }

  options.headers = { ...options?.headers, ...authHeaders };

  try {
    let uri = `${endpoint}/api/v1/${url}`;
    if (navigator.language) {
      uri += (url.includes("?") ? `&` : '?') + `i18n=${navigator.language}`;
    }
    const resp = await fetch(uri, options);
    if (resp.ok) {
      return { data: await resp.json(), error: null };
    } else {
      return { data: null, error: await resp.text() };
    }
  } catch (e) {
    return { data: null, error: String(e) };
  }
};

export const fetchSettings = createAsyncThunk(
  "hhd/fetchSettings",
  async ({ endpoint, token }: Credentials) => {
    return await fetchFn(endpoint, token, "settings");
  }
);

export const fetchState = createAsyncThunk(
  "hhd/fetchState",
  async ({ endpoint, token }: Credentials) => {
    return await fetchFn(endpoint, token, "state");
  }
);

export const updateSettingValue = createAsyncThunk(
  "hhd/updateSettingValue",
  async ({
    path,
    value,
    cred,
  }: {
    path: string;
    value: any;
    cred: Credentials;
  }) => {
    const body = set({}, path, value);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };

    return await fetchFn(cred.endpoint, cred.token, "state", options);
  }
);

export const fetchSectionNames = createAsyncThunk(
  "hhd/fetchSectionNames",
  async ({ endpoint, token }: Credentials) => {
    return await fetchFn(endpoint, token, "sections");
  }
);
