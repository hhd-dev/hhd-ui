import hhdSlice from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";
import { navigateSections } from "./sectionsNavigation";

let gpIndex: number = -1;
let timeoutId: number | undefined;

export const setupGamepadEventListener = () => {
  window.addEventListener("gamepadconnected", function (event) {
    gpIndex = event.gamepad.index;
    const gp = navigator.getGamepads()[gpIndex];
    if (!gp) return;
    store.dispatch(hhdSlice.actions.setController(true));

    updateLoop();
  });

  window.addEventListener("gamepaddisconnected", function (event) {
    // Do something on disconnect
    gpIndex = -1;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  });
};

function updateLoop() {
  if (gpIndex >= 0) {
    const gp = navigator.getGamepads()[gpIndex];
    if (gp) {
      // gamepad is connected

      navigateSections(gp);
    }
    timeoutId = setTimeout(() => window.requestAnimationFrame(updateLoop), 150);
  }
}
