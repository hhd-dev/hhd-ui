import { useSelector } from "react-redux";
import { selectUiType } from "../redux-modules/hhdSlice";

export const useUiType = () => {
  const uiType = useSelector(selectUiType);
  return uiType;
};
