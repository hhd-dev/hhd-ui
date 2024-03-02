import { debounce } from "lodash";
import hhdSlice from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";
import { navigateHhdComponents } from "./hhdComponentsNavigation";
import { navigateSections } from "./sectionsNavigation";

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const cancelAnimationFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;

let gpIndex: number = -1;
let animationFrameId: number | undefined;

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
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = undefined;
    }
  });
};

function updateLoop() {
  if (gpIndex >= 0) {
    const gp = navigator.getGamepads()[gpIndex];
    if (gp) {
      // gamepad is connected

      navigateSections(gp);
      navigateHhdComponents(gp);
    }
    animationFrameId = requestAnimationFrame(updateLoop);
  }
}
