import hhdSlice from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";

window.addEventListener("gamepadconnected", function (event) {
  store.dispatch(hhdSlice.actions.setController(true));
});

window.addEventListener("gamepaddisconnected", function (event) {
  // Do something on disconnect
});
