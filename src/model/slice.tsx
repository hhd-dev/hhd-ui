import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { get, set } from "lodash";
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
  getSetting,
  getSettingChoices,
} from "./common";
import {
  fetchSectionNames,
  fetchSettings,
  fetchState,
  updateSettingValue,
} from "./thunks";

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
export const EXPERT_HIDDEN = ["expert", ...DEFAULT_HIDDEN];

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

interface NavigationState {
  curr: Record<string, string>;
  choices: Record<string, string[]>;
  smooth: boolean;
  help: boolean;
  sel: boolean;
  sel_choice: any | null;
}

interface AppState {
  uiType: UiType;
  prevUiType: PrevUiType;
  appType: AppType;
  controller: boolean;
  login: boolean;
  state: State;
  settings: Sections;
  loading: { [loadState: string]: boolean };
  error: string;
  sectionNames: { [key: string]: string };
  tagFilter: TagFilterType;
  navigation: NavigationState;
  loadCounter: number;
}

export interface RootState {
  hhd: AppState;
}

const initialState = {
  uiType: "expanded",
  prevUiType: "init",
  appType: "web",
  controller: false,
  login: true,
  state: {},
  settings: {},
  loading: {
    settings: false,
    state: false,
    update: false,
  },
  error: "",
  sectionNames: {},
  tagFilter: "advanced",
  loadCounter: 0,
  navigation: {
    curr: {},
    choices: {},
    smooth: false,
    help: false,
    sel: false,
    sel_choice: null,
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
    clearState: (store) => {
      store.loading = initialState.loading;
      store.settings = initialState.settings;
      store.state = initialState.state;
      store.navigation = initialState.navigation;
    },
    setTagFilter: (store, action: PayloadAction<TagFilterType>) => {
      const tagFilter = action.payload;
      window.localStorage.setItem(TAG_FILTER_CACHE_KEY, `${tagFilter}`);
      store.tagFilter = tagFilter;
      updateNavigation(store);
    },
    setController: (store, action: PayloadAction<boolean>) => {
      store.controller = action.payload;
    },
    setUiType: (store, action: PayloadAction<UiType>) => {
      if (store.appType !== "overlay") return;
      store.prevUiType = store.uiType;
      store.uiType = action.payload;
    },
    toggleUiType: (store) => {
      if (store.appType !== "overlay") return;

      store.prevUiType = store.uiType;
      if (store.uiType === "qam") {
        store.uiType = "expanded";
      } else if (store.uiType === "expanded") {
        store.uiType = "qam";
      }
    },
    setAppType: (store, action: PayloadAction<AppType>) => {
      store.appType = action.payload;
      if (action.payload === "overlay") store.controller = true;
    },
    setError: (store, action: PayloadAction<string>) => {
      store.error = action.payload;
    },
    setShowHint: (store, action: PayloadAction<boolean>) => {
      store.navigation.help = action.payload;
    },
    clearError: (store) => {
      store.error = "";
    },
    replaceState: (
      store,
      action: PayloadAction<{ state: any; settings: any }>
    ) => {
      const { state, settings } = action.payload;
      if (settings) store.settings = settings;
      if (state) store.state = state;
      updateNavigation(store);
    },

    goPrev: (store, action: PayloadAction<{ section: string } | undefined>) => {
      if (store.navigation.sel) {
        const { setting } = selectSelectedSetting({ hhd: store });
        if (!setting) return;
        const choices = Object.keys(getSettingChoices(setting));
        if (choices.length) {
          const idx = choices.indexOf(store.navigation.sel_choice);
          if (idx === -1 || idx <= 0) return;
          store.navigation.sel_choice = choices[idx - 1];
          return;
        } else {
          store.navigation.sel = false;
          store.navigation.sel_choice = null;
        }
      }
      if (store.uiType === "closed" && store.appType === "overlay") return;
      let section;
      if (action.payload) {
        section = action.payload.section;
      } else {
        section = store.uiType === "qam" ? "qam" : store.navigation.curr["tab"];
      }
      if (!store.navigation.choices[section]) return;
      const idx = store.navigation.choices[section].indexOf(
        store.navigation.curr[section]
      );
      if (idx > 0) {
        store.navigation.curr[section] =
          store.navigation.choices[section][idx - 1];
      }
      store.navigation.smooth = true;
    },
    goNext: (store, action: PayloadAction<{ section: string } | undefined>) => {
      if (store.navigation.sel) {
        const { setting } = selectSelectedSetting({ hhd: store });
        if (!setting) return;
        const choices = Object.keys(getSettingChoices(setting));
        if (choices.length) {
          const idx = choices.indexOf(String(store.navigation.sel_choice));
          if (idx === -1 || idx >= choices.length - 1) return;
          store.navigation.sel_choice = choices[idx + 1];
          return;
        } else {
          store.navigation.sel = false;
          store.navigation.sel_choice = null;
        }
      }
      if (store.uiType === "closed" && store.appType === "overlay") return;
      let section;
      if (action.payload) {
        section = action.payload.section;
      } else {
        section = store.uiType === "qam" ? "qam" : store.navigation.curr["tab"];
      }
      if (!store.navigation.choices[section]) return;
      const idx = store.navigation.choices[section].indexOf(
        store.navigation.curr[section]
      );
      if (idx !== -1 && idx < store.navigation.choices[section].length - 1) {
        store.navigation.curr[section] =
          store.navigation.choices[section][idx + 1];
      }
      store.navigation.smooth = true;
    },
    goto: (store, action: PayloadAction<{ section: string; curr: string }>) => {
      const { section, curr } = action.payload;
      store.navigation.curr[section] = curr;
      store.navigation.sel = false;
      if (section !== "tab") store.navigation.smooth = false;
    },
    select: (store) => {
      if (store.navigation.sel) return;
      const path = selectFocusedPath({ hhd: store });
      const setting = selectFocusedSetting({ hhd: store });
      if (!setting || !path) {
        return;
      }
      const val = selectSettingState(
        path + (setting.type === "mode" ? ".mode" : "")
      )({ hhd: store });
      store.navigation.sel = true;
      store.navigation.sel_choice = String(val);
    },
    unselect: (store) => {
      if (store.navigation.sel) {
        store.navigation.sel = false;
        store.navigation.sel_choice = null;
        return;
      }

      if (store.appType !== "overlay") return;
      store.prevUiType = store.uiType;
      store.uiType = "closed";
    },
    incLoadCounter: (store) => {
      store.loadCounter += 1;
    },
    login: (store) => {
      store.login = true;
    },
    logout: (store) => {
      store.login = false;
      store.loading = initialState.loading;
      store.settings = initialState.settings;
      store.state = initialState.state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.pending, (state) => {
      state.loading.settings = true;
    });
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      if (action.payload.data) state.settings = action.payload.data;
      if (action.payload.error)
        state.error = "Could not fetch data. Is Handheld Daemon running?";
      updateNavigation(state);
      state.loading.settings = false;
    });
    builder.addCase(fetchState.pending, (state) => {
      state.loading.state = true;
    });
    builder.addCase(fetchState.fulfilled, (state, action) => {
      if (action.payload.data) state.state = action.payload.data;
      if (action.payload.error)
        state.error = "Could not fetch data. Is Handheld Daemon running?";
      updateNavigation(state);
      state.loading.state = false;
    });

    builder.addCase(updateSettingValue.pending, (state) => {
      state.loading.update = true;
    });
    builder.addCase(updateSettingValue.fulfilled, (state, action) => {
      if (action.payload.data) state.state = action.payload.data;
      if (action.payload.error)
        state.error = "Could not fetch data. Is Handheld Daemon running?";
      updateNavigation(state);
      state.loading.update = false;
    });
    builder.addCase(fetchSectionNames.fulfilled, (state, action) => {
      state.sectionNames = action.payload.data || {};
    });
  },
});

function updateNavigation(state: AppState) {
  if (!Object.keys(state.state).length || !Object.keys(state.settings).length)
    return;

  // QAMs
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
  return tagFilter === "advanced" ? EXPERT_HIDDEN : DEFAULT_HIDDEN;
};

const selectFilters = (state: RootState) => {
  const tagFilter = selectTagFilter(state);

  return getFilters(tagFilter);
};

export const selectIsLoggedIn = (state: RootState) => {
  return (
    !state.hhd.loading.settings &&
    !state.hhd.loading.state &&
    selectHasState(state)
  );
};

export const selectIsLoading = (state: RootState) => {
  return state.hhd.loading.settings || state.hhd.loading.state;
};

export const selectError = (state: RootState) => {
  return state.hhd.error;
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

export const selectTagFilter = (state: RootState) => state.hhd.tagFilter;

export const selectSectionNames = (state: RootState) => state.hhd.sectionNames;

export const selectUiType = (state: RootState) => {
  return state.hhd.uiType;
};

export const selectPrevUiType = (state: RootState) => {
  return state.hhd.prevUiType;
};

export const selectLoadCounter = (state: RootState) => {
  return state.hhd.loadCounter;
};

export const selectShowHint = (state: RootState) => {
  return (
    state.hhd.controller &&
    state.hhd.navigation.help &&
    (state.hhd.appType !== "overlay" || state.hhd.uiType !== "closed")
  );
};

export const selectFocusedPath = (state: RootState) => {
  let section;
  if (state.hhd.uiType === "qam" && state.hhd.appType === "overlay") {
    section = "qam";
  } else {
    section = state.hhd.navigation.curr["tab"];
  }

  return state.hhd.navigation.curr[section];
};

export const selectFocusedSetting = (state: RootState) => {
  const path = selectFocusedPath(state);
  if (!path) return null;
  return getSetting(state.hhd.settings, path);
};

export const selectHasHint = (state: RootState) => {
  const s = selectFocusedSetting(state);
  return Boolean(s && s.hint);
};

export const selectIsSelected = (path: string) => {
  return (state: RootState) =>
    selectFocusedPath(state) === path && state.hhd.navigation.sel;
};

export const selectSelectedChoice = (state: RootState) => {
  return state.hhd.navigation.sel_choice;
};

export const selectSelectedSetting = (state: RootState) => {
  const s = selectFocusedSetting(state);

  if (!state.hhd.navigation.sel || !s)
    return {
      setting: null,
      path: null,
    };

  return {
    setting: s,
    path: selectFocusedPath(state),
  };
};

export default slice;
