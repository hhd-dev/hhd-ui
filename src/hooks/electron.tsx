import { useEffect } from "react";

const ANIMATION_DELAY = 500;

let interval: number | undefined;

export const useHddRelayEffect = (appType: string, uiType: string) => {
  // Inform that Daemon should close the UI
  useEffect(() => {
    if (appType !== "overlay" || uiType !== "closed") return;

    interval = setInterval(() => {
      const closeOverlay = window.electronUtilsRender?.closeOverlay;
      if (closeOverlay) closeOverlay();
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
