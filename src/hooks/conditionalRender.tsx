import { useSelector } from "react-redux";
import { selectTagFilter } from "../redux-modules/hhdSlice";
import { useCallback, useMemo } from "react";

export const useShouldRenderChild = () => {
  const filters = useFilters();

  const shouldRenderChild = useCallback(
    (tags: string[]) => {
      if (tags.some((v) => filters.includes(v as any))) {
        return false;
      }

      if (
        tags.indexOf("hhd-update-decky") >= 0 ||
        tags.indexOf("hhd-version-display-decky") >= 0
      ) {
        return false;
      }

      return true;
    },
    [filters]
  );

  return shouldRenderChild;
};

function useFilters() {
  const tagFilter = useSelector(selectTagFilter);

  const filters = useMemo(() => {
    if (tagFilter === "simple") {
      return ["advanced", "expert"];
    } else if (tagFilter === "advanced") {
      return ["expert"];
    }

    return [];
  }, [tagFilter]);

  return filters;
}

export const useShouldRenderParent = () => {
  const shouldRenderChild = useShouldRenderChild();

  return shouldRenderParent(shouldRenderChild);
};

const shouldRenderParent =
  (shouldRenderChild: any) => (plugins: { [key: string]: any }) => {
    const shouldRenderChildrenValues = Object.values(plugins).map((p) => {
      if (p.tags && !shouldRenderChild(p.tags)) {
        // if parent for children shuoldn't be rendered, no children should be rendered
        return false;
      }

      const children = p.children;

      if (!children) {
        return false;
      }

      const res = Object.values(children).map((c) => {
        const { tags } = c as any;
        if (!tags) {
          return true;
        }
        return shouldRenderChild(tags);
      });

      // if there's any true values
      // this means there is a child that should be rendered
      return res.indexOf(true) >= 0;
    });
    if (shouldRenderChildrenValues.indexOf(true) == -1) {
      // if there's no `true` value, that means all children should not be rendered
      // so don't render the parent either
      return false;
    }
    return true;
  };
