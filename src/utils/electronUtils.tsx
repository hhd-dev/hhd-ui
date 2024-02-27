import { clearLoggedIn, setLoggedIn } from "../local";
import { router } from "../main";
import hhdSlice, { ErrorStates, UiType } from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";

export const login = (hhdToken: string, appType: UiType) => {
  window.localStorage.setItem("hhd_token", `${hhdToken}`);
  store.dispatch(hhdSlice.actions.setUiType(appType));

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
