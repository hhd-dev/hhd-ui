import { useDispatch } from "react-redux";
import {
  TAG_FILTER_CACHE_KEY,
  TagFilterType,
  TagFilters,
} from "../components/TagFilterDropdown";
import {
  fetchSectionNames,
} from "../redux-modules/hhdAsyncThunks";
import hhdSlice from "../redux-modules/hhdSlice";
import { disablePolling, enablePolling } from "../redux-modules/polling";
import { AppDispatch } from "../redux-modules/store";
import { useEffect } from "react";

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    disablePolling();
  } else {
    enablePolling();
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

    enablePolling();
    dispatch(fetchSectionNames());
  }, []);
}

export default useInitialFetch;
