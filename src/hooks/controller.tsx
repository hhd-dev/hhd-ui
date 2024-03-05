import { useDispatch, useSelector } from "react-redux";
import { updateHhdState } from "../model/thunks";
import { AppDispatch } from "../model/store";
import {
  selectSettingState,
  selectUpdateHhdStatePending,
} from "../model/slice";

export function useSettingState<A>(path: string) {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector(selectSettingState(path)) as A | undefined;

  const setState = (value: any) => {
    const action = updateHhdState({ path, value });
    console.log(path, value);
    return dispatch(action);
  };

  return { state, setState };
}

export const useUpdateHhdStatePending = () => {
  const loading = useSelector(selectUpdateHhdStatePending);

  return loading;
};
