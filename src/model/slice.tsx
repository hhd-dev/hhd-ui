import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { get, set } from "lodash";
import {
  TAG_FILTER_CACHE_KEY,
  TagFilterType,
} from "../components/TagFilterDropdown";
import { Sections, State } from "./common";
import { RootState } from "./store";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchSectionNames,
  updateHhdState,
} from "./thunks";

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
  unit?: string;
  tags?: string[];
  max?: number;
  children?: { [childName: string]: SettingsType };
};

export type UiType = "expanded" | "notification" | "qam" | "closed";
export type PrevUiType = UiType | "init";
export type AppType = "web" | "app" | "overlay";

export type LoadingStatusType = "idle" | "pending" | "succeeded" | "failed";

interface NavigationState {
  curr: Record<string, string>;
  choices: Record<string, string[]>;
}

interface AppState {
  uiType: UiType;
  prevUiType: PrevUiType;
  appType: AppType;
  controller: boolean;
  state: State;
  settings: Sections;
  loading: { [loadState: string]: LoadingStatusType };
  error: { [key: string]: string };
  sectionNames: { [key: string]: string };
  tagFilter: TagFilterType;
  navigation: NavigationState;
}

const initialState = {
  uiType: "expanded",
  prevUiType: "init",
  appType: "web",
  controller: false,
  state: {},
  settings: {},
  loading: {
    settings: "idle",
    state: "idle",
    updateHhdState: "idle",
  },
  error: {},
  sectionNames: {},
  tagFilter: "advanced",
  navigation: {
    curr: {},
    choices: {},
  },
} as AppState;

const slice = createSlice({
  name: "hhd",
  initialState,
  reducers: {
    updateHhdState: (
      store,
      action: PayloadAction<{ path: string; value: any }>
    ) => {
      const { path, value } = action.payload;
      set(store.state, path, value);
    },
    resetHhdState: (store) => {
      store.loading = initialState.loading;
      store.settings = initialState.settings;
      store.state = initialState.state;
    },
    setTagFilter: (store, action: PayloadAction<TagFilterType>) => {
      const tagFilter = action.payload;
      window.localStorage.setItem(TAG_FILTER_CACHE_KEY, `${tagFilter}`);
      store.tagFilter = tagFilter;
    },
    setController: (store, action: PayloadAction<boolean>) => {
      store.controller = action.payload;
    },
    setUiType: (store, action: PayloadAction<UiType>) => {
      store.prevUiType = store.uiType;
      store.uiType = action.payload;
    },
    setAppType: (store, action: PayloadAction<AppType>) => {
      store.appType = action.payload;
      if (action.payload === "overlay") store.controller = true;
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
      store.state = action.payload;
    },

    goPrev: (store, action: PayloadAction<{ section: string }>) => {
      const { section } = action.payload;
      if (!store.navigation.choices[section]) return;
      const idx = store.navigation.choices[section].indexOf(
        store.navigation.curr[section]
      );
      if (idx > 0) {
        store.navigation.curr[section] =
          store.navigation.choices[section][idx - 1];
      }
    },
    goNext: (store, action: PayloadAction<{ section: string }>) => {
      const { section } = action.payload;
      if (!store.navigation.choices[section]) return;
      const idx = store.navigation.choices[section].indexOf(
        store.navigation.curr[section]
      );
      if (idx !== -1 && idx < store.navigation.choices[section].length - 1) {
        store.navigation.curr[section] =
          store.navigation.choices[section][idx + 1];
      }
    },
    goto: (store, action: PayloadAction<{ section: string; curr: string }>) => {
      const { section, curr } = action.payload;
      store.navigation.curr[section] = curr;
    },

    goSet: (
      store,
      action: PayloadAction<{ section: string; choices: string[] }>
    ) => {
      const { section, choices } = action.payload;
      store.navigation.choices[section] = choices;
      const curr = store.navigation.curr[section];
      if (curr === undefined || !choices.includes(curr)) {
        store.navigation.curr[section] = choices[0];
      }
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
      state.loading.state = "pending";
    });
    builder.addCase(fetchHhdSettingsState.fulfilled, (state, action) => {
      state.state = action.payload;
      state.loading.state = "succeeded";
    });

    builder.addCase(updateHhdState.pending, (state) => {
      state.loading.updateHhdState = "pending";
    });
    builder.addCase(updateHhdState.fulfilled, (state, action) => {
      state.state = action.payload;
      state.loading.updateHhdState = "succeeded";
    });
    builder.addCase(fetchSectionNames.fulfilled, (state, action) => {
      state.sectionNames = action.payload || {};
    });
  },
});

// selectors

export const selectAppType = (state: RootState) => {
  return state.hhd.appType;
};

export const selectSettings = (state: RootState) => {
  return state.hhd.settings;
};

export const selectState = (state: RootState) => {
  return state.hhd.state;
};

export const selectSettingState = (path: string) => {
  return (state: RootState) => {
    return get(state.hhd.state, path, null);
  };
};

export const selectHasController = (state: RootState) => {
  return state.hhd.controller;
};

export const selectSettingsLoading = (state: RootState) =>
  state.hhd.loading.settings;

export const selectSettingsStateLoading = (state: RootState) =>
  state.hhd.loading.state;

export const selectHasState = (state: RootState) =>
  Boolean(state.hhd.state.hhd?.http);

export const selectUpdateHhdStatePending = (state: RootState) => {
  return state.hhd.loading.updateHhdState === "pending";
};

export const selectAllHhdSettingsLoading = (state: RootState) => {
  return (
    selectSettingsLoading(state) === "pending" ||
    selectSettingsStateLoading(state) === "pending"
  );
};

export const selectLoginErrorMessage = (state: RootState) => {
  return state.hhd.error[ErrorStates.LoginFailed];
};

export const selectTagFilter = (state: RootState) => state.hhd.tagFilter;

export const selectSectionNames = (state: RootState) => state.hhd.sectionNames;

export const selectUiType = (state: RootState) => {
  return state.hhd.uiType;
};

export const selectPrevUiType = (state: RootState) => {
  return state.hhd.prevUiType;
};

export default slice;
