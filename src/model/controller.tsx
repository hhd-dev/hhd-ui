import { NumberSetting } from "./common";
import local from "./local";
import hhdSlice, {
  selectFocusedPath,
  selectFocusedSetting,
  selectIsOpen,
  selectIsSelected,
  selectSelectedChoice,
  selectSelectedSetting,
  selectSettingState,
} from "./slice";
import { store } from "./store";
import { updateSettingValue } from "./thunks";

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

declare global {
  interface Window {
    controllerInterval: number | undefined;
  }
}

const goIn = (s: typeof store) => {
  const state = s.getState();
  const setting = selectFocusedSetting(state);
  const path = selectFocusedPath(state);
  const isSel = selectIsSelected(path)(state);
  const curr = selectSettingState(path)(state);
  const selChoice = selectSelectedChoice(state);

  const url = local.selectors.selectUrl(state);
  const token = local.selectors.selectToken(state);

  if (!setting || !path || !url || !token) {
    s.dispatch(hhdSlice.actions.select());
    return;
  }

  const val = selectSettingState(path)(state) as any;

  switch (setting.type) {
    case "bool":
      s.dispatch(
        updateSettingValue({
          cred: { token, endpoint: url },
          path,
          value: !val,
        })
      );
      break;
    case "action":
      s.dispatch(
        updateSettingValue({
          cred: { token, endpoint: url },
          path,
          value: true,
        })
      );
      break;
    case "mode":
      if (isSel) {
        console.log(path);
        if (curr !== selChoice)
          s.dispatch(
            updateSettingValue({
              cred: { token, endpoint: url },
              path: path + ".mode",
              value: selChoice,
            })
          );
        s.dispatch(hhdSlice.actions.unselect());
      } else {
        s.dispatch(hhdSlice.actions.select());
      }
      break;
    case "multiple":
    case "discrete":
      if (isSel) {
        console.log(path);
        if (curr !== selChoice)
          s.dispatch(
            updateSettingValue({
              cred: { token, endpoint: url },
              path,
              value:
                setting.type === "discrete" ? Number(selChoice) : selChoice,
            })
          );
        s.dispatch(hhdSlice.actions.unselect());
      } else {
        s.dispatch(hhdSlice.actions.select());
      }
      break;
    default:
      s.dispatch(hhdSlice.actions.select());
  }
};

const goSideways = (s: typeof store, left: boolean) => {
  const state = s.getState();
  const { setting, path } = selectSelectedSetting(state);
  if (!setting || !path || !["float", "int"].includes(setting.type)) return;
  const numSet = setting as NumberSetting<number, "float" | "int">;

  const url = local.selectors.selectUrl(state);
  const token = local.selectors.selectToken(state);

  if (!setting || !path || !url || !token) {
    s.dispatch(hhdSlice.actions.select());
    return;
  }
  const val = selectSettingState(path)(state) as unknown as number;

  let newVal = val;
  if (left) {
    newVal -= numSet.step || 1;
  } else {
    newVal += numSet.step || 1;
  }

  s.dispatch(
    updateSettingValue({
      cred: { token, endpoint: url },
      path,
      value: newVal,
    })
  );
};

export const setupGamepadEventListener = () => {
  let state: Record<string, Record<string, number | null>> = {};

  function updateLoop() {
    const time = new Date().getTime();
    if (!selectIsOpen(store.getState())) return;

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
            goSideways(store, true);
            break;
          case "dpad_right":
          case "right":
            goSideways(store, false);
            break;
          case "lb":
            store.dispatch(hhdSlice.actions.goPrev({ section: "tab" }));
            break;
          case "rb":
            store.dispatch(hhdSlice.actions.goNext({ section: "tab" }));
            break;
          case "x":
            store.dispatch(hhdSlice.actions.setShowHint(true));
            break;
          case "x_up":
            store.dispatch(hhdSlice.actions.setShowHint(false));
            break;
          case "a":
            goIn(store);
            break;
          case "b":
            store.dispatch(hhdSlice.actions.unselect());
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
    window.controllerInterval = setInterval(updateLoop, 75);
    // if (!animationFrameId) animationFrameId = requestAnimationFrame(updateLoop);
  });

  window.addEventListener("gamepaddisconnected", function () {
    if (navigator.getGamepads()) return;

    // If there are no gamepads, remove animation frame id
    if (window.controllerInterval) {
      clearInterval(window.controllerInterval);
      window.controllerInterval = undefined;
    }
  });
};
