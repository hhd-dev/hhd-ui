import { useSelector } from "react-redux";
import { Setting } from "../model/common";
import { selectShouldRenderFilters, shouldRenderChild } from "../model/slice";

export const useShouldRenderChild = (isQam: boolean) => {
  const filters = useSelector(selectShouldRenderFilters(isQam));

  const closure = (set: Setting): boolean => {
    return shouldRenderChild(set, filters);
  };

  return closure;
};

export const useShouldRenderParent = (isQam: boolean = false) => {
  const shouldRenderChild = useShouldRenderChild(isQam);

  function parentClosure(plugins: Record<string, Setting>) {
    return Object.values(plugins).some(shouldRenderChild);
  }
  return parentClosure;
};
