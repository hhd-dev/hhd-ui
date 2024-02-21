import { fetchFn } from "./hhdAsyncThunks";
import hhdSlice, { selectVersionHashes } from "./hhdSlice";
import { store } from "./store";

import { get } from "lodash";

let intervalId: number | undefined;

export const hhdPollingInterval = () => {
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

      // Apply new state
      store.dispatch(hhdSlice.actions.overrideSettingsState(newState));
    }, 1000);
  }
};
