import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { get, set, update } from "lodash";
import {
  TAG_FILTER_CACHE_KEY,
  TagFilterType,
} from "../components/TagFilterDropdown";
import {
  ContainerSetting,
  ModeSetting,
  Sections,
  Setting,
  State,
} from "./common";
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

export const DEFAULT_HIDDEN = [
  "hidden",
  "hhd-update-decky",
  "hhd-version-display-decky",
];
export const QAM_FILTERS = [
  "non-essential",
  "advanced",
  "expert",
  ...DEFAULT_HIDDEN,
];

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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHhdSettings.pending, (state) => {
      state.loading.settings = "pending";
    });
    builder.addCase(fetchHhdSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      updateNavigation(state);
      state.loading.settings = "succeeded";
    });
    builder.addCase(fetchHhdSettingsState.pending, (state) => {
      state.loading.state = "pending";
    });
    builder.addCase(fetchHhdSettingsState.fulfilled, (state, action) => {
      state.state = action.payload;
      updateNavigation(state);
      state.loading.state = "succeeded";
    });

    builder.addCase(updateHhdState.pending, (state) => {
      state.loading.updateHhdState = "pending";
    });
    builder.addCase(updateHhdState.fulfilled, (state, action) => {
      state.state = action.payload;
      updateNavigation(state);
      state.loading.updateHhdState = "succeeded";
    });
    builder.addCase(fetchSectionNames.fulfilled, (state, action) => {
      state.sectionNames = action.payload || {};
    });
  },
});

function updateNavigation(state: AppState) {
  if (!Object.keys(state.state).length || !Object.keys(state.settings).length)
    return;

  // QAM
  const shouldRenderQam = (c: Setting) => shouldRenderChild(c, QAM_FILTERS);
  const choices = getSectionElements(
    state.settings,
    state.state,
    shouldRenderQam
  );
  state.navigation.choices["qam"] = choices;
  if (!choices.includes(state.navigation.curr["qam"])) {
    state.navigation.curr["qam"] = choices[0];
  }

  // Tabs
  const shouldRender = (c: Setting) =>
    shouldRenderChild(c, getFilters(state.tagFilter));

  for (const [s, v] of Object.entries(state.settings)) {
    const newS: Sections = {};
    newS[s] = v;
    const choices = getSectionElements(newS, state.state, shouldRender);
    state.navigation.choices[s] = choices;
    if (!choices.includes(state.navigation.curr[s])) {
      state.navigation.curr[s] = choices[0];
    }
  }

  // Tab Headers
  function shouldRenderParent(containers: Record<string, Setting>) {
    return Object.values(containers).some(shouldRender);
  }
  const keys = Object.entries(state.settings)
    .filter(([_, data]) => shouldRenderParent(data))
    .map(([name, _]) => name);

  state.navigation.choices["tab"] = keys;
  if (!keys.includes(state.navigation.curr["tab"]))
    state.navigation.curr["tab"] = keys[0];
}

// selectors

function getSectionElements(
  set: Sections,
  state: State,
  shouldRender: (s: Setting) => boolean
) {
  let out = [];
  for (const [section, cs] of Object.entries(set)) {
    for (const [name, v] of Object.entries(cs).filter(
      (c) => c[1].type === "container"
    )) {
      out.push(
        ...getFocusElements(
          v,
          state[section][name],
          `${section}.${name}`,
          shouldRender
        )
      );
    }
  }
  return out;
}

function getFocusElements(
  set: Setting,
  state: State,
  path: string,
  shouldRender: (s: Setting) => boolean
) {
  if (!shouldRender(set)) return [];

  const type = set.type;

  let out: string[] = [];
  switch (type) {
    case "bool":
    case "multiple":
    case "discrete":
    case "int":
    case "float":
    case "action":
      return [path];
    case "container":
      for (const [k, v] of Object.entries((set as ContainerSetting).children)) {
        out.push(
          ...getFocusElements(v, state[k], `${path}.${k}`, shouldRender)
        );
      }
      return out;
    case "mode":
      out = [path];
      const mode = state["mode"] as unknown as string;
      const data = (set as ModeSetting).modes[mode];
      if (data) {
        out.push(
          ...getFocusElements(
            data,
            state[mode],
            `${path}.${mode}`,
            shouldRender
          )
        );
      }
      return out;
  }

  return [];
}

export const shouldRenderChild = (set: Setting, filters: string[]): boolean => {
  const tags = set.tags;

  const children =
    set.type === "container" && (set as ContainerSetting).children;

  if (tags && tags.some((v: string) => filters.includes(v))) {
    return false;
  }

  if (children) {
    return Object.values(children).some((c) => shouldRenderChild(c, filters));
  }

  return true;
};

const getFilters = (tagFilter: string) => {
  return tagFilter === "advanced"
    ? ["expert", ...DEFAULT_HIDDEN]
    : DEFAULT_HIDDEN;
};

const selectFilters = (state: RootState) => {
  const tagFilter = selectTagFilter(state);

  return getFilters(tagFilter);
};

export const selectShouldRenderFilters = (qam: boolean) => {
  return (state: RootState) => (qam ? QAM_FILTERS : selectFilters(state));
};

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
