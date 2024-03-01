import { fetchFn } from "./hhdAsyncThunks";
import hhdSlice from "./hhdSlice";
import { store } from "./store";

import { get } from "lodash";

let abort: AbortController | undefined;

const LEGACY_DELAY = 100;
const MIN_WAITTIME_NEW = 250;
const MIN_WAITTIME_OLD = 1000;

async function pollState(a: AbortController) {
  let start = Date.now();
  try {
    while (!a.signal.aborted) {
      // Fetch
      const state = store.getState();
      const currHash = get(
        state,
        "hhd.settings.hhd.version.value",
        get(state, "hhd.settingsState.version", "")
      );

      const newState = await fetchFn("state?poll", { signal: a.signal });
      const newHash = get(newState, "version", "");

      // If settings changed reload them
      if (newState && newHash !== currHash) {
        const settings = await fetchFn("settings", { signal: a.signal });
        store.dispatch(hhdSlice.actions.overrideSettings(settings));
      }

      // Apply new state
      if (
        newState &&
        JSON.stringify(state.hhd.settingsState) !== JSON.stringify(newState)
      ) {
        store.dispatch(hhdSlice.actions.overrideSettingsState(newState));
      }

      const del = Date.now() - start;
      let waitTime: number | null = null;
      if (del < LEGACY_DELAY) {
        // If less than 100ms, we are using a legacy
        // handheld daemon version. Avoid overloading.
        waitTime = MIN_WAITTIME_OLD - del;
      } else if (del < MIN_WAITTIME_NEW) {
        waitTime = MIN_WAITTIME_NEW - del;
      }

      // We count the time before the request starts
      // to ensure that we make at most 1 / MIN_DELAY_LEGACY per sec
      start = Date.now();

      if (waitTime != null && waitTime > 0) {
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
    pollState(abort).catch((_) => {});
  } catch (e) {
    console.log(e);
  }
  return () => {
    if (abort) {
      abort.abort("Stopping polling due to cleanup.");
      abort = undefined;
    }
  };
};
