import { useDispatch, useSelector } from "react-redux";
import hhdSlice from "../model/slice";
import { AppDispatch, RootState } from "../model/store";
import { useEffect, useRef } from "react";

export const useSectionNav = (section: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const curr = useSelector(
    (state: RootState) => state.hhd.navigation.curr[section]
  );
  const setCurr = (curr: string) => {
    dispatch(hhdSlice.actions.goto({ section, curr }));
  };

  return { curr, setCurr };
};

export function useElementNav<T extends HTMLElement>(
  section: string,
  path: string
) {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<T>(null);

  const focus = useSelector((state: RootState) => {
    if (!state.hhd.controller) return false;
    if (section === "qam" && state.hhd.uiType !== "qam") return false;
    if (section !== "qam" && state.hhd.uiType === "qam") return false;
    if (section !== "qam" && state.hhd.navigation.curr["tab"] !== section)
      return false;

    return state.hhd.navigation.curr[section] === path;
  });
  const setFocus = () => {
    dispatch(hhdSlice.actions.goto({ section, curr: path }));
  };

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.focus();
    }
  }, [focus, ref.current]);

  return { ref, focus, setFocus };
}
