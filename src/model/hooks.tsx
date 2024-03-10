import { useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import hhdSlice, {
  RootState,
  selectAppType,
  selectError,
  selectIsSelected,
  selectLoadCounter,
  selectPrevUiType,
  selectSelectedSetting,
  selectShouldRenderFilters,
  selectUiType,
  shouldRenderChild,
} from "../model/slice";

import { Setting } from "./common";
import { local } from "./local";
import { disablePolling, enablePolling } from "./polling";
import { selectSettingState } from "./slice";
import { store } from "./store";
import {
  fetchSectionNames,
  fetchSettings,
  fetchState,
  updateSettingValue,
} from "./thunks";

export function useElementNav<T extends HTMLElement>(
  section: string,
  path: string
) {
  const dispatch = useDispatch();
  const ref = useRef<T>(null);

  const focus = useSelector((state: RootState) => {
    if (!state.hhd.controller) return false;
    if (section === "qam" && state.hhd.uiType !== "qam") return false;
    if (section !== "qam" && state.hhd.uiType === "qam") return false;
    if (section !== "qam" && state.hhd.navigation.curr["tab"] !== section)
      return false;

    return state.hhd.navigation.curr[section] === path;
  });
  const smooth = useSelector((state: RootState) => state.hhd.navigation.smooth);
  const sel = useSelector(selectIsSelected(path));

  const setFocus = () => {
    if (!focus) dispatch(hhdSlice.actions.goto({ section, curr: path }));
  };

  useEffect(() => {
    if (focus && ref.current) {
      if (smooth)
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // ref.current.focus({ preventScroll: true });
    }
  }, [focus, ref.current, smooth]);

  return { ref, focus, sel, setFocus };
}

export const useSectionNav = (section: string) => {
  const dispatch = useDispatch();

  const curr = useSelector(
    (state: RootState) => state.hhd.navigation.curr[section]
  );
  const setCurr = (curr: string) => {
    dispatch(hhdSlice.actions.goto({ section, curr }));
  };

  return { curr, setCurr };
};

export const useRelayEffect = () => {
  const uiType = useSelector(selectUiType);
  const prevUiType = useSelector(selectPrevUiType);
  const appType = useSelector(selectAppType);

  const CLOSE_DELAY = 500;

  // Inform that Daemon should close the UI
  useEffect(() => {
    if (appType !== "overlay") return;

    let delay = 0;
    if (uiType === "closed" && prevUiType !== "init") delay = CLOSE_DELAY;

    let interval: number | null = setInterval(() => {
      const updateStatus = window.electronUtilsRender?.updateStatus;
      if (updateStatus) updateStatus(uiType);
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }, delay);

    //Clearing the interval
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [uiType, appType]);
};

export const useShouldRenderChild = (isQam: boolean) => {
  const filters = useSelector(selectShouldRenderFilters(isQam));

  const closure = (set: Setting): boolean => {
    return shouldRenderChild(set, filters);
  };

  return closure;
};

export const useShouldRenderParent = (isQam: boolean = false) => {
  const shouldRenderChild = useShouldRenderChild(isQam);

  function parentClosure(plugins: Record<string, Setting>) {
    return Object.values(plugins).some(shouldRenderChild);
  }
  return parentClosure;
};

export const useError = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const setError = (error: string) => {
    dispatch(hhdSlice.actions.setError(error));
  };

  return { error, setError };
};

export const useLogin = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { token } = useToken();
  const { url } = useUrl();

  const login = () => {
    dispatch(hhdSlice.actions.clearState());
    dispatch(hhdSlice.actions.clearError());
    dispatch(fetchSettings({ token, endpoint: url }));
    dispatch(fetchState({ token, endpoint: url }));
    dispatch(fetchSectionNames({ token, endpoint: url }));
    dispatch(hhdSlice.actions.login());
    enablePolling(false);
  };

  return login;
};

export const useLogout = () => {
  const dispatch = useDispatch<typeof store.dispatch>();

  const logout = () => {
    dispatch(hhdSlice.actions.clearState());
    dispatch(hhdSlice.actions.clearError());
    dispatch(hhdSlice.actions.logout());
    disablePolling();
  };

  return logout;
};

export function useSettingState<A>(path: string) {
  const dispatch = useDispatch<typeof store.dispatch>();
  const state = useSelector(selectSettingState(path)) as A | undefined;
  const { token } = useToken();
  const { url } = useUrl();

  const setState = (value: any) => {
    const action = updateSettingValue({
      cred: { token, endpoint: url },
      path,
      value,
    });
    console.log(path, value);
    return dispatch(action);
  };

  return { state, setState };
}

export function useFilter() {
  const filter = useSelector(local.selectors.selectFilter);
  const dispatch = useDispatch();
  const setFilter = (filter: "advanced" | "expert") =>
    dispatch(local.actions.setFilter(filter));
  return { filter, setFilter };
}

export function useUrl() {
  const url = useSelector(local.selectors.selectUrl);
  const dispatch = useDispatch();
  const setUrl = (url: string | null) => dispatch(local.actions.setUrl(url));
  return { url, setUrl };
}

export function useToken() {
  const token = useSelector(local.selectors.selectToken);
  const dispatch = useDispatch();
  const setToken = (token: string) => dispatch(local.actions.setToken(token));
  return { token, setToken };
}

export function useIsLocal() {
  return useSelector(local.selectors.selectIsLocal);
}

export function useInitialLogin() {
  const login = useLogin();
  const canLogIn = useSelector(local.selectors.selectCanLogin);

  // Use load counter so electron can force relogin
  const loadCounter = useSelector(selectLoadCounter);

  useEffect(() => {
    if (canLogIn) login();
  }, [loadCounter]);
}

export function useSelectedSetting() {
  return useSelector(selectSelectedSetting, shallowEqual);
}
