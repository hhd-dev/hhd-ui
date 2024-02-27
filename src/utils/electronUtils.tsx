import { clearLoggedIn, setLoggedIn } from "../local";
import { router } from "../main";
import hhdSlice, { ErrorStates } from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";

export const login = (hhdToken: string, isElectron = true) => {
  window.localStorage.setItem("hhd_token", `${hhdToken}`);
  window.localStorage.setItem("hhd_electron", `${isElectron}`);
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

export const setUiType = (uiType: string) => {
  if (uiType === "qam" || uiType === "notification" || uiType === "full-ui") {
    store.dispatch(hhdSlice.actions.setUiType(uiType));
  }
};

export const clearUiType = () => {
  store.dispatch(hhdSlice.actions.setUiType(undefined));
};
