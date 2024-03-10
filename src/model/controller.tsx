import hhdSlice, { selectAppType, selectUiType } from "./slice";
import { store } from "./store";

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
  guide: 16,
};

const REPEAT_INITIAL = 500;
const REPEAT_INTERVAL = 200;

const AXIS_MAP: [string, number, boolean][] = [
  ["left", 0, true],
  ["right", 0, false],
  ["up", 1, true],
  ["down", 1, false],
];

export const setupGamepadEventListener = () => {
  let interval: number | null = null;
  let state: Record<string, Record<string, number | null>> = {};

  function updateLoop() {
    const time = new Date().getTime();

    for (const [gidx, gp] of navigator.getGamepads().entries()) {
      if (!gp) continue;

      const evs = [];

      // Handle buttons
      for (const [name, idx] of Object.entries(BUTTON_MAP)) {
        // Grab data
        const curr = state[gidx] ? Boolean(state[gidx][name]) : null;
        const next = gp.buttons[idx]?.pressed;

        // Update state
        if (!state[gidx]) {
          state[gidx] = {};
        }

        // Push event
        if (curr !== next) {
          if (next) {
            evs.push(name);
            // Skip repeats for x, a, b
            if (["x", "a", "b"].includes(name)) state[gidx][name] = time + 1e15;
            else state[gidx][name] = time + REPEAT_INITIAL;
          } else {
            // Keep when x is released
            if (name == "x") evs.push("x_up");
            state[gidx][name] = null;
          }
        }
      }

      // Handle Axis events
      for (const [name, ax, neg] of AXIS_MAP) {
        const curr = state[gidx] ? Boolean(state[gidx][name]) : null;
        let next = false;
        if (gp.axes[ax]) next = neg ? gp.axes[ax] < -0.6 : gp.axes[ax] > 0.6;

        // Update state
        if (!state[gidx]) {
          state[gidx] = {};
        }

        // Push event
        if (curr !== next) {
          if (next) {
            evs.push(name);
            state[gidx][name] = time + REPEAT_INITIAL;
          } else {
            state[gidx][name] = null;
          }
        }
      }

      // Allow repeats
      for (const [gidx, gps] of Object.entries(state)) {
        for (const [name, start] of Object.entries(gps)) {
          if (!start) continue;
          if (time < start) continue;
          evs.push(name);
          state[gidx][name] = time + REPEAT_INTERVAL;
        }
      }

      // Handle gamepad events
      if (!evs) continue;

      // Ignore guide combos
      if (state[gidx].guide) continue;

      const uiType = selectUiType(store.getState());
      const appType = selectAppType(store.getState());

      for (const ev of evs) {
        switch (ev) {
          case "dpad_up":
          case "up":
            store.dispatch(hhdSlice.actions.goPrev());
            break;
          case "dpad_down":
          case "down":
            store.dispatch(hhdSlice.actions.goNext());
            break;
          case "dpad_left":
          case "left":
            break;
          case "dpad_right":
          case "right":
            break;
          case "lb":
            store.dispatch(hhdSlice.actions.goPrev());
            break;
          case "rb":
            store.dispatch(hhdSlice.actions.goNext());
            break;
          case "x":
            store.dispatch(hhdSlice.actions.setShowHint(true));
            break;
          case "x_up":
            store.dispatch(hhdSlice.actions.setShowHint(false));
            break;
          case "a":
            store.dispatch(hhdSlice.actions.goIn());
            break;
          case "b":
            store.dispatch(hhdSlice.actions.goOut());
            break;
          case "y":
            store.dispatch(hhdSlice.actions.toggleUiType());
            break;
        }
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
