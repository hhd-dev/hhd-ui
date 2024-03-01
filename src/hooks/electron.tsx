import { useEffect } from "react";
import {
  selectAppType,
  selectPrevUiType,
  selectUiType,
} from "../redux-modules/hhdSlice";
import { useSelector } from "react-redux";

const CLOSE_DELAY = 300;

let interval: number | undefined;

export const useHddRelayEffect = () => {
  const uiType = useSelector(selectUiType);
  const prevUiType = useSelector(selectPrevUiType);
  const appType = useSelector(selectAppType);

  // Inform that Daemon should close the UI
  useEffect(() => {
    if (appType !== "overlay") return;

    let delay = 0;
    if (uiType === "closed" && prevUiType !== "init") delay = CLOSE_DELAY;

    interval = setInterval(() => {
      const updateStatus = window.electronUtilsRender?.updateStatus;
      if (updateStatus) updateStatus(uiType);
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    }, delay);

    //Clearing the interval
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    };
  }, [uiType, appType]);
};
