import hhdSlice from "../redux-modules/hhdSlice";
import { store } from "../redux-modules/store";

const BUTTON_MAP = {
  lb: 4,
  rb: 5,
  dpad_up: 12,
  dpad_down: 13,
  dpad_left: 14,
  dpad_right: 15,
  a: 0,
  b: 1,
  x: 2,
  y: 3,
};

const AXIS_MAP: [string, number, boolean][] = [
  ["left", 0, true],
  ["right", 0, false],
  ["up", 1, true],
  ["down", 1, false],
];

export const setupGamepadEventListener = () => {
  let interval: number | null = null;
  let state: Record<string, Record<string, boolean>> = {};

  function updateLoop() {
    for (const [gidx, gp] of navigator.getGamepads().entries()) {
      if (!gp) continue;

      const evs = [];

      // Handle buttons
      for (const [name, idx] of Object.entries(BUTTON_MAP)) {
        // Grab data
        const curr = state[gidx] ? state[gidx][name] : null;
        const next = gp.buttons[idx].pressed;

        // Push event
        if (curr !== next && next) {
          evs.push(name);
        }

        // Update state
        if (!state[gidx]) {
          state[gidx] = { name: next };
        } else {
          state[gidx][name] = next;
        }
      }

      // Handle Axis events
      for (const [name, ax, neg] of AXIS_MAP) {
        const curr = state[gidx] ? state[gidx][name] : null;
        const next = neg ? gp.axes[ax] < -0.6 : gp.axes[ax] > 0.6;

        // Push event
        if (curr !== next && next) {
          evs.push(name);
        }

        // Update state
        if (!state[gidx]) {
          state[gidx] = { name: next };
        } else {
          state[gidx][name] = next;
        }
      }

      // Handle gamepad events
      for (const ev of evs) {
        console.log(ev);
      }
    }
  }

  window.addEventListener("gamepadconnected", function () {
    store.dispatch(hhdSlice.actions.setController(true));

    updateLoop();
    interval = setInterval(updateLoop, 75);
    // if (!animationFrameId) animationFrameId = requestAnimationFrame(updateLoop);
  });

  window.addEventListener("gamepaddisconnected", function () {
    if (navigator.getGamepads()) return;

    // If there are no gamepads, remove animation frame id
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  });
};
