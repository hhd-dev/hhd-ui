import { useSelector } from "react-redux";
import { selectTagFilter } from "../redux-modules/hhdSlice";

export const DEFAULT_HIDDEN = [
  "hidden",
  "hhd-update-decky",
  "hhd-version-display-decky",
];
export const QAM_FILTERS = ["advanced", "expert", ...DEFAULT_HIDDEN];

export const useShouldRenderChild = (filters: string[] | null = null) => {
  const currentFilters = useFilters();
  const actualFilters = filters || currentFilters;

  const shouldRenderChild = (
    tags: string[] | null,
    children: any[] | null = null
  ) => {
    if (tags && tags.some((v: string) => actualFilters.includes(v))) {
      // if parent for children shuoldn't be rendered, no children should be rendered
      return false;
    }

    if (children == null) return true;

    if (!children) {
      return false;
    }

    const res = Object.values(children).map((c) => {
      const { tags } = c as any;
      if (!tags) {
        return true;
      }
      return !tags.some((v: string) => actualFilters.includes(v));
    });

    // if there's any true values
    // this means there is a child that should be rendered
    return res.indexOf(true) >= 0;
  };

  return shouldRenderChild;
};

function useFilters() {
  const tagFilter = useSelector(selectTagFilter);
  return tagFilter === "advanced"
    ? ["expert", ...DEFAULT_HIDDEN]
    : DEFAULT_HIDDEN;
}

export const useShouldRenderParent = (filters: string[] | null = null) => {
  const shouldRenderChild = useShouldRenderChild(filters);

  function parentClosure(plugins: { [key: string]: any }) {
    return Object.values(plugins).some((p) =>
      shouldRenderChild(p.tags, p.children)
    );
  }
  return parentClosure;
};
