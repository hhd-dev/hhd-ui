import { useSelector } from "react-redux";
import {
  SettingsType,
  selectTagFilter,
  selectUiType,
  selectHhdSettings,
} from "../model/slice";
import { ContainerSetting, Setting } from "../model/common";

export const DEFAULT_HIDDEN = [
  "hidden",
  "hhd-update-decky",
  "hhd-version-display-decky",
];
export const QAM_FILTERS = [
  "non-essential",
  "advanced",
  "expert",
  ...DEFAULT_HIDDEN,
];

export const useShouldRenderChild = (isQam: boolean) => {
  const currentFilters = useFilters();
  const actualFilters = isQam ? QAM_FILTERS : currentFilters;

  const shouldRenderChild = (set: Setting): boolean => {
    const tags = set.tags;

    const children =
      set.type === "container" && (set as ContainerSetting).children;

    if (tags && tags.some((v: string) => actualFilters.includes(v))) {
      return false;
    }

    if (children) {
      return Object.values(children).some(shouldRenderChild);
    }

    return true;
  };

  return shouldRenderChild;
};

function useFilters() {
  const tagFilter = useSelector(selectTagFilter);

  return tagFilter === "advanced"
    ? ["expert", ...DEFAULT_HIDDEN]
    : DEFAULT_HIDDEN;
}

export const useShouldRenderParent = (isQam: boolean = false) => {
  const shouldRenderChild = useShouldRenderChild(isQam);

  function parentClosure(plugins: Record<string, Setting>) {
    return Object.values(plugins).some(shouldRenderChild);
  }
  return parentClosure;
};
