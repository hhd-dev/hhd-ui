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
            state[gidx][name] = time + REPEAT_INITIAL;
          } else {
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

      let curr: string | null = store.getState().hhd.navigation.curr["tab"];
      if (uiType === "closed" && appType === "overlay") {
        curr = null;
      } else if (uiType === "qam") {
        curr = "qam";
      }

      for (const ev of evs) {
        switch (ev) {
          case "dpad_up":
          case "up":
            if (curr)
              store.dispatch(hhdSlice.actions.goPrev({ section: curr }));
            break;
          case "dpad_down":
          case "down":
            if (curr)
              store.dispatch(hhdSlice.actions.goNext({ section: curr }));
            break;
          case "dpad_left":
          case "left":
            break;
          case "dpad_right":
          case "right":
            break;
          case "lb":
            store.dispatch(hhdSlice.actions.goPrev({ section: "tab" }));
            break;
          case "rb":
            store.dispatch(hhdSlice.actions.goNext({ section: "tab" }));
            break;
          case "y":
            if (appType !== "overlay") break;

            if (uiType === "qam") {
              store.dispatch(hhdSlice.actions.setUiType("expanded"));
            } else if (uiType === "expanded") {
              store.dispatch(hhdSlice.actions.setUiType("qam"));
            }

            break;
          case "b":
            if (appType !== "overlay") break;

            if (uiType !== "closed") {
              store.dispatch(hhdSlice.actions.setUiType("closed"));
            }

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
