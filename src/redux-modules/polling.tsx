import { fetchFn } from "./hhdAsyncThunks";
import hhdSlice from "./hhdSlice";
import { store } from "./store";

import { get } from "lodash";

let intervalId: number | undefined;

export const hhdPollingInterval = () => {
  try {
    if (!intervalId) {
      intervalId = window.setInterval(async () => {
        const state = store.getState();
        const currHash = get(
          state,
          "hhd.settings.hhd.version.value",
          get(state, "hhd.settingsState.version", "")
        );

        const newState = await fetchFn("state");
        const newHash = get(newState, "version", "");

        // If settings changed reload them
        if (newHash !== currHash) {
          const settings = await fetchFn("settings");
          store.dispatch(hhdSlice.actions.overrideSettings(settings));
        }

        if (
          JSON.stringify(state.hhd.settingsState) !== JSON.stringify(newState)
        ) {
          // Apply new state
          store.dispatch(hhdSlice.actions.overrideSettingsState(newState));
        }
      }, 1000);
    }
  } catch (e) {
    console.log(e);
  }
};
