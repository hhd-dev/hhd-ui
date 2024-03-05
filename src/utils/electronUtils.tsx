import { clearLoggedIn, setLoggedIn } from "../local";
import { router } from "../main";
import hhdSlice, { AppType, ErrorStates, UiType } from "../model/slice";
import { store } from "../model/store";

export const login = (hhdToken: string) => {
  window.localStorage.setItem("hhd_token", `${hhdToken}`);

  setLoggedIn();
  store.dispatch(hhdSlice.actions.resetHhdState());
  store.dispatch(hhdSlice.actions.clearError(ErrorStates.LoginFailed));

  router.navigate("/ui");
};

export const logout = () => {
  clearLoggedIn();
  store.dispatch(hhdSlice.actions.resetHhdState());
  store.dispatch(hhdSlice.actions.clearError(ErrorStates.LoginFailed));
  router.navigate("/");
};

export const setUiType = (uiType: UiType) => {
  store.dispatch(hhdSlice.actions.setUiType(uiType));
};

export const setAppType = (appType: AppType) => {
  store.dispatch(hhdSlice.actions.setAppType(appType));
};
