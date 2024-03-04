import { useSelector } from "react-redux";
import {
  SettingsType,
  selectTagFilter,
  selectUiType,
  selectHhdSettings,
} from "../redux-modules/hhdSlice";

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

  const shouldRenderChild = (
    tags: string[] | null,
    children: any[] | null = null,
    modes: any[] | null = null
  ): boolean => {
    if (tags && tags.some((v: string) => actualFilters.includes(v))) {
      return false;
    }

    if (children) {
      return Object.values(children).some((c) =>
        shouldRenderChild(c.tags, c.children, c.modes)
      );
    }

    if (modes) {
      return Object.values(modes).some((c) => {
        return shouldRenderChild(c.tags, c.children, c.modes);
      });
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

  function parentClosure(plugins: { [key: string]: any }) {
    return Object.values(plugins).some((p) =>
      shouldRenderChild(p.tags, p.children, p.modes)
    );
  }
  return parentClosure;
};

export const useFilteredSettings = () => {
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const shouldRenderParent = useShouldRenderParent(false);

  Object.entries(settings).forEach(([name, plugins]) => {
    if (!shouldRenderParent(plugins) && settings[name]) {
      delete settings[name];
    }
  });

  return settings;
};
