import { debounce } from "lodash";

let hhdComponents: HTMLElement[] = [];

let currentSectionIndex = 0;

export const navigateHhdComponents = (gp: Gamepad) => {
  const el = document.activeElement;
  const dPadUp = gp.buttons[12];
  const dPadDown = gp.buttons[13];
  const dPadLeft = gp.buttons[14];
  const dPadRight = gp.buttons[15];
  const aButton = gp.buttons[0];
  const bButton = gp.buttons[1];

  try {
    if (dPadUp.pressed) {
      if (el?.role === "menuitemradio") {
        sendButtonPressToElectron("up");
      } else {
        sendButtonPressToElectron("dPadUp");
      }
    }
    if (dPadDown.pressed) {
      if (el?.role === "menuitemradio") {
        sendButtonPressToElectron("down");
      } else {
        sendButtonPressToElectron("dPadDown");
      }
    }
    if (dPadLeft.pressed) {
      sendButtonPressToElectron("dPadLeft");
    }
    if (dPadRight.pressed) {
      sendButtonPressToElectron("dPadRight");
    }
    if (aButton.pressed) {
      sendButtonPressToElectron("aButton");
    }
    if (bButton.pressed) {
      sendButtonPressToElectron("bButton");
    }
  } catch (e) {
    console.error("error while listening for section buttons", e);
  }
};

export const focusCurrentHhdElement = () => {
  hhdComponents[currentSectionIndex]?.focus();
};

export const registerHhdElement = (el: any) => {
  hhdComponents.push(el);
};

export const resetHhdElements = () => {
  currentSectionIndex = 0;
  hhdComponents = [];
};

const sendButtonPressToElectron = debounce(
  sendButtonPressToElectronOriginal,
  70
);

function sendButtonPressToElectronOriginal(buttonPressed: string) {
  if (window.electronUtilsRender?.gamepadButtonPress) {
    window.electronUtilsRender.gamepadButtonPress(buttonPressed);
  }
}
