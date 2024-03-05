import { fetchFn } from "./thunks";
import hhdSlice from "./slice";
import { store } from "./store";

import { get } from "lodash";

let abort: AbortController | undefined;

const LEGACY_DELAY = 100;
const MIN_WAITTIME_NEW = 250;
const MIN_WAITTIME_OLD = 1000;
const ERROR_WAITTIME = 3000;

async function pollState(a: AbortController, reload: boolean) {
  let start = Date.now();
  let initial = reload;
  try {
    while (!a.signal.aborted) {
      // Fetch
      const state = store.getState();
      const currHash = get(
        state,
        "hhd.settings.hhd.version.value",
        get(state, "hhd.settingsState.version", "")
      );

      const newState = await fetchFn(
        initial ? "state" : "state?poll",
        {
          signal: a.signal,
        },
        true
      );
      const newHash = get(newState, "version", "");
      initial = false;

      // If settings changed reload them
      if (newState && newHash !== currHash) {
        const settings = await fetchFn("settings", { signal: a.signal }, true);
        if (settings)
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
      if (!newState) {
        waitTime = ERROR_WAITTIME;
      } else if (del < LEGACY_DELAY) {
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

export const enablePolling = (reload: boolean) => {
  if (abort) return;
  try {
    abort = new AbortController();
    pollState(abort, reload).catch((_) => {});
  } catch (e) {
    console.log(e);
  }
};

export const disablePolling = () => {
  if (abort) {
    abort.abort("Stopping polling due to cleanup.");
    abort = undefined;
  }
};
