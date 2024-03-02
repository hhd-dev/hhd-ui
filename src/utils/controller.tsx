import hhdSlice from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";

window.addEventListener("gamepadconnected", function (event) {
  const gp = navigator.getGamepads()[event.gamepad.index];
  if (!gp) return;
  store.dispatch(hhdSlice.actions.setController(true));

  setInterval(() => {
    for (let i = 0; i < gp.buttons.length; i++) {
      if (gp.buttons[i].value) console.log(i);
    }
  }, 70);
});

window.addEventListener("gamepaddisconnected", function (event) {
  // Do something on disconnect
});
