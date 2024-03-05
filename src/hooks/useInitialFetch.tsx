import { useDispatch } from "react-redux";
import {
  TAG_FILTER_CACHE_KEY,
  TagFilterType,
  TagFilters,
} from "../components/TagFilterDropdown";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchSectionNames,
} from "../model/thunks";
import hhdSlice from "../model/slice";
import { disablePolling, enablePolling } from "../model/polling";
import { AppDispatch } from "../model/store";
import { useEffect } from "react";

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    disablePolling();
  } else {
    enablePolling(true);
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
    enablePolling(false);
  }, []);
}

export default useInitialFetch;
