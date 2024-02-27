import { fetchFn } from "./hhdAsyncThunks";
import hhdSlice from "./hhdSlice";
import { store } from "./store";

import { get } from "lodash";

let abort: AbortController | undefined;

const MIN_WAITTIME_NEW = 250;
const MIN_WAITTIME_OLD = 1000;

async function pollState(a: AbortController) {
  try {
    while (!a.signal.aborted) {
      const start = Date.now();

      // Fetch
      const state = store.getState();
      const currHash = get(
        state,
        "hhd.settings.hhd.version.value",
        get(state, "hhd.settingsState.version", "")
      );

      const newState = await fetchFn("state", { signal: a.signal });
      const newHash = get(newState, "version", "");

      // If settings changed reload them
      if (newHash !== currHash) {
        const settings = await fetchFn("settings", { signal: a.signal });
        store.dispatch(hhdSlice.actions.overrideSettings(settings));
      }

      // Apply new state
      if (
        JSON.stringify(state.hhd.settingsState) !== JSON.stringify(newState)
      ) {
        store.dispatch(hhdSlice.actions.overrideSettingsState(newState));
      }

      const del = Date.now() - start;
      let waitTime: number | null = null;
      if (del < 100) {
        // If less than 100ms, we are using a legacy
        // handheld daemon version. Avoid overloading.
        waitTime = MIN_WAITTIME_OLD - del;
      } else if (del < MIN_WAITTIME_NEW) {
        waitTime = MIN_WAITTIME_NEW - del;
      }

      if (waitTime != null) {
        const actWaitTime = waitTime;
        const p = new Promise((r) =>
          setTimeout(r, actWaitTime, { signal: a.signal })
        );
        await p;
      }
    }
  } catch (e) {}
}

export const hhdPollingInterval = () => {
  try {
    if (abort) return;

    abort = new AbortController();
    pollState(abort);
  } catch (e) {
    console.log(e);
  }
  return () => {
    if (abort) {
      abort.abort();
      abort = undefined;
    }
  };
};
