import { handleGamepadCommands } from "./controller";
import local from "./local";
import hhdSlice, { AppType, UiType } from "./slice";
import { store } from "./store";

export const login = (token: string) => {
  store.dispatch(hhdSlice.actions.clearState());
  store.dispatch(hhdSlice.actions.clearError());
  if (token) store.dispatch(local.actions.setToken(token));
  store.dispatch(local.actions.setUrl("http://localhost:5335"));
  store.dispatch(hhdSlice.actions.incLoadCounter());
};

export const logout = () => {
  store.dispatch(hhdSlice.actions.clearState());
  store.dispatch(hhdSlice.actions.clearError());
};

export const setUiType = (uiType: UiType) => {
  store.dispatch(hhdSlice.actions.setUiType(uiType));
};

export const setAppType = (appType: AppType) => {
  store.dispatch(hhdSlice.actions.setAppType(appType));
};

export const sendGamepadEvent = (ev: string) => {
  store.dispatch(hhdSlice.actions.setController(true));
  handleGamepadCommands([ev]);
};

export const setControllerApi = (enabled: boolean) => {
  store.dispatch(hhdSlice.actions.setControllerApi(enabled));
};
