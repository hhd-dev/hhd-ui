import { fetchFn } from "./hhdAsyncThunks";
import hhdSlice, { selectVersionHashes } from "./hhdSlice";
import { store } from "./store";

let intervalId: number | undefined;

export const hhdPollingInterval = () => {
  if (!intervalId) {
    intervalId = window.setInterval(async () => {
      const state = store.getState();

      const settings = await fetchFn("settings");
      const settingsState = await fetchFn("state");

      const currentVersionHashes = selectVersionHashes(state);

      const updatedVersionHashes = selectVersionHashes({
        hhd: { settings, settingsState } as any,
      });

      if (updatedVersionHashes.settings !== currentVersionHashes.settings) {
        store.dispatch(hhdSlice.actions.overrideSettings(settings));
        store.dispatch(hhdSlice.actions.overrideSettingsState(settingsState));
      }
      //   if (updatedVersionHashes.state !== currentVersionHashes.state) {
      //   }
    }, 1000);
  }
};
