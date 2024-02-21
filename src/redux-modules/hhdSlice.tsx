import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { get, set } from "lodash";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchSectionNames,
  updateHhdState,
} from "./hhdAsyncThunks";
import { RootState } from "./store";

export enum ErrorStates {
  LoginFailed = "LoginFailed",
}

export type SettingType =
  | "bool"
  | "container"
  | "mode"
  | "discrete"
  | "multiple"
  | "int"
  | "display"
  | "action";

export type SettingsType = {
  type: SettingType;
  title: string;
  default?: any;
  hint?: string;
  options?: any;
  modes?: any;
  min?: number;
  tags?: string[];
  max?: number;
  children?: { [childName: string]: SettingsType };
};

export type LoadingStatusType = "idle" | "pending" | "succeeded" | "failed";

interface HhdState {
  settingsState?: any;
  settings?: any;
  loading: { [loadState: string]: LoadingStatusType };
  error: { [key: string]: string };
  sectionNames: { [key: string]: string };
}

const initialState = {
  settingsState: {},
  settings: {},
  loading: {
    settings: "idle",
    settingsState: "idle",
    updateHhdState: "idle",
  },
  error: {},
  sectionNames: {},
} as HhdState;

const hhdSlice = createSlice({
  name: "hhd",
  initialState,
  reducers: {
    updateHhdState: (
      store,
      action: PayloadAction<{ path: string; value: any }>
    ) => {
      const { path, value } = action.payload;
      set(store.settingsState, path, value);
    },
    resetHhdState: (store, action: PayloadAction<void>) => {
      store.loading = initialState.loading;
      store.settings = initialState.settings;
      store.settingsState = initialState.settingsState;
    },
    setError: (
      store,
      action: PayloadAction<{ errorName: string; errorMessage: string }>
    ) => {
      const { errorName, errorMessage } = action.payload;

      set(store.error, errorName, errorMessage);
    },
    clearError: (store, action: PayloadAction<string>) => {
      const errorName = action.payload;

      delete store.error[errorName];
    },
    overrideSettings: (store, action: PayloadAction<any>) => {
      store.settings = action.payload;
    },
    overrideSettingsState: (store, action: PayloadAction<any>) => {
      store.settingsState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHhdSettings.pending, (state) => {
      state.loading.settings = "pending";
    });
    builder.addCase(fetchHhdSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading.settings = "succeeded";
    });
    builder.addCase(fetchHhdSettingsState.pending, (state) => {
      state.loading.settingsState = "pending";
    });
    builder.addCase(fetchHhdSettingsState.fulfilled, (state, action) => {
      state.settingsState = action.payload;
      state.loading.settingsState = "succeeded";
    });

    builder.addCase(updateHhdState.pending, (state) => {
      state.loading.updateHhdState = "pending";
    });
    builder.addCase(updateHhdState.fulfilled, (state, action) => {
      state.settingsState = action.payload;
      state.loading.updateHhdState = "succeeded";
    });
    builder.addCase(fetchSectionNames.fulfilled, (state, action) => {
      state.sectionNames = action.payload || {};
    });
  },
});

// selectors

export const selectHhdSettings = (state: RootState) => {
  return state.hhd.settings;
};

export const selectHhdSettingsState = (state: RootState) => {
  return state.hhd.settingsState;
};

const selectHhdSettingsLoading = (state: RootState) =>
  state.hhd.loading.settings;

const selectHhdSettingsStateLoading = (state: RootState) =>
  state.hhd.loading.settingsState;

export const selectUpdateHhdStatePending = (state: RootState) => {
  return state.hhd.loading.updateHhdState === "pending";
};

export const selectAllHhdSettingsLoading = (state: RootState) => {
  return (
    selectHhdSettingsLoading(state) === "pending" ||
    selectHhdSettingsStateLoading(state) === "pending"
  );
};

export const selectHhdStateLoadingStatuses = (state: RootState) => {
  return {
    stateLoading: selectHhdSettingsStateLoading(state),
    settingsLoading: selectHhdSettingsLoading(state),
  };
};

export const selectLoginErrorMessage = (state: RootState) => {
  return state.hhd.error[ErrorStates.LoginFailed];
};

export const selectHints = (state: RootState) => {
  const settings = state.hhd.settings as {
    [key: string]: { [key: string]: SettingsType };
  };

  const hints: { [k: string]: any } = {};

  Object.entries(settings).forEach(([topLevelStr, plugins], idx) => {
    Object.keys(plugins).forEach((pluginName, idx) => {
      const extractHints = (
        setting: SettingsType,
        hints: { [k: string]: any }
      ) => {
        if (setting.hint && setting.title) {
          hints[setting.title] = setting.hint;
        }
        if (setting.children) {
          hints[setting.title] = {
            hint: setting.hint,
            type: setting.type,
            children: {},
          };
          Object.values(setting.children).forEach((s) =>
            extractHints(s, hints[setting.title].children)
          );
        }
        if (setting.modes) {
          hints[setting.title] = {
            hint: setting.hint,
            type: setting.type,
            modes: {},
          };
          Object.values(setting.modes).forEach((s) =>
            //@ts-ignore
            extractHints(s, hints[setting.title].modes)
          );
        }
      };
      const topLevelSetting = plugins[pluginName] as SettingsType;

      extractHints(topLevelSetting, hints);
    });
  });

  return hints;
};

export const selectSectionNames = (state: RootState) => state.hhd.sectionNames;

export const selectVersionHashes = (state: RootState) => {
  return {
    state: get(state, "hhd.settingsState.version", ""),
    settings: get(state, "hhd.settings.hhd.version.value", ""),
  };
};

export default hhdSlice;
