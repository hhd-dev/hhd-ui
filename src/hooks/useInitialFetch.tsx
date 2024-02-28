import { useDispatch } from "react-redux";
import {
  TAG_FILTER_CACHE_KEY,
  TagFilterType,
  TagFilters,
} from "../components/TagFilterDropdown";
import { isLoggedIn } from "../local";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchSectionNames,
} from "../redux-modules/hhdAsyncThunks";
import hhdSlice from "../redux-modules/hhdSlice";
import { hhdPollingInterval } from "../redux-modules/polling";
import { AppDispatch } from "../redux-modules/store";
import { useEffect } from "react";

let clearHhdInterval: any;

document.addEventListener("visibilitychange", () => {
  clearHhdInterval && clearHhdInterval();
  clearHhdInterval = undefined;

  if (!document.hidden && isLoggedIn()) {
    clearHhdInterval = hhdPollingInterval();
  }
});

function useInitialFetch() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const tagFilter = window.localStorage.getItem(
      TAG_FILTER_CACHE_KEY
    ) as TagFilterType | null;

    if (tagFilter && TagFilters[tagFilter]) {
      dispatch(hhdSlice.actions.setTagFilter(tagFilter));
    }

    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
    dispatch(fetchSectionNames());
    clearHhdInterval = hhdPollingInterval();

    return () => {
      if (clearHhdInterval) {
        clearHhdInterval();
        clearHhdInterval = undefined;
      }
    };
  }, []);
}

export default useInitialFetch;
