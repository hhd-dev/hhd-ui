import { fetchFn } from "./thunks";
import hhdSlice, { selectIsLoading, selectIsLoggedIn } from "./slice";
import { store } from "./store";

import { get } from "lodash";
import local from "./local";

let abort: AbortController | undefined;

const LEGACY_DELAY = 100;
const MIN_WAITTIME_NEW = 250;
const MIN_WAITTIME_OLD = 1000;
const ERROR_WAITTIME = 3000;
const LOAD_DELAY = 100;

async function pollState(a: AbortController, reload: boolean) {
  let start = Date.now();
  let initial = reload;
  try {
    while (!a.signal.aborted) {
      // Check the backend is not loading
      // If yes, wait a bit
      if (selectIsLoading(store.getState())) {
        const p = new Promise((r) =>
          setTimeout(r, LOAD_DELAY, { signal: a.signal })
        );
        await p;
        continue;
      }

      if (!selectIsLoggedIn(store.getState())) break;

      // Fetch
      const state = store.getState();
      const currHash = get(
        state,
        "hhd.settings.hhd.version.value",
        get(state, "hhd.state.version", "")
      );

      const login = selectIsLoggedIn(store.getState());
      const url = local.selectors.selectUrl(store.getState());
      const token = local.selectors.selectToken(store.getState());
      if (!login) return;

      const newState = (
        await fetchFn(url, token, initial ? "state" : "state?poll", {
          signal: a.signal,
        })
      ).data;
      const newHash = get(newState, "version", "");
      initial = false;

      // If settings changed reload them
      if (newState && newHash !== currHash) {
        const settings = (
          await fetchFn(url, token, "settings", {
            signal: a.signal,
          })
        ).data;
        if (settings)
          store.dispatch(hhdSlice.actions.overrideSettings(settings));
      }

      // Apply new state
      if (
        newState &&
        JSON.stringify(state.hhd.state) !== JSON.stringify(newState)
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
  if (abort) disablePolling();
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

window.addEventListener("focus", () => enablePolling(true));
window.addEventListener("blur", () => disablePolling());
