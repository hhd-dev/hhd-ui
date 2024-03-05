import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import hhdSlice from "../model/slice";
import { AppDispatch, RootState } from "../model/store";

export const useSectionNav = (section: string, choices: string[]) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(hhdSlice.actions.goSet({ section, choices }));
  }, [choices]);

  const curr = useSelector(
    (state: RootState) => state.hhd.navigation.curr[section]
  );
  const setCurr = (curr: string) => {
    dispatch(hhdSlice.actions.goto({ section, curr }));
  };

  return { curr, setCurr };
};

export const useElementNav = (section: string, choice: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const isFocused = useSelector(
    (state: RootState) => state.hhd.navigation.curr[section] === choice
  );
  const setFocus = () => {
    dispatch(hhdSlice.actions.goto({ section, curr: choice }));
  };
  return { isFocused, setFocus };
};

export const useNavigationCounter = () => {
  let val = 0;

  return () => val++;
};
