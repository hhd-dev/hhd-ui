import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import hhdSlice from "../redux-modules/hhdSlice";
import { AppDispatch, RootState } from "../redux-modules/store";

export const useSectionNav = (section: string, max: number) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(hhdSlice.actions.goMax({ section, max }));
  }, [max]);

  const currentIndex = useSelector(
    (state: RootState) => state.hhd.navigation.idx[section] || 0
  );
  const setCurrentIndex = (idx: number) => {
    dispatch(hhdSlice.actions.goto({ section, idx }));
  };

  return { currentIndex, setCurrentIndex };
};

export const useElementNav = (section: string, idx: number) => {
  const dispatch = useDispatch<AppDispatch>();

  const isFocused =
    useSelector(
      (state: RootState) => state.hhd.navigation.idx[section] || 0
    ) === idx;
  const setFocus = () => {
    dispatch(hhdSlice.actions.goto({ section, idx }));
  };
  return { isFocused, setFocus };
};
