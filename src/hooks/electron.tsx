import { useEffect } from "react";
import { AppType, UiType } from "../redux-modules/hhdSlice";

const ANIMATION_DELAY = 300;

let interval: number | undefined;

export const useHddRelayEffect = (appType: AppType, uiType: UiType) => {
  // Inform that Daemon should close the UI
  useEffect(() => {
    if (appType !== "overlay") return;

    interval = setInterval(() => {
      const updateStatus = window.electronUtilsRender?.updateStatus;
      if (updateStatus) updateStatus(uiType);
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    }, ANIMATION_DELAY);

    //Clearing the interval
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    };
  }, [uiType, appType]);
};
