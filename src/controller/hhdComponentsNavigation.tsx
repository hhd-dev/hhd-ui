import { debounce } from "lodash";

let hhdComponents: HTMLElement[] = [];

let currentSectionIndex = 0;

const prevItem = debounce(prevItemOriginal, 70);
const nextItem = debounce(nextItemOriginal, 70);

export const navigateHhdComponents = (gp: Gamepad) => {
  const dPadUp = gp.buttons[12];
  const dPadDown = gp.buttons[13];

  try {
    if (dPadUp.pressed || dPadDown.pressed) {
      const currentEl = document.activeElement as HTMLElement;
      if (!hhdComponents.includes(currentEl)) {
        focusCurrentHhdElement();
      }
    }

    if (dPadUp.pressed) {
      prevItem();
    }
    if (dPadDown.pressed) {
      nextItem();
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

function prevItemOriginal() {
  if (currentSectionIndex === 0) {
    currentSectionIndex = hhdComponents.length - 1;
  } else {
    currentSectionIndex--;
  }
  //   console.log(hhdComponents[currentSectionIndex]);
  hhdComponents[currentSectionIndex].focus();
}

function nextItemOriginal() {
  if (currentSectionIndex == hhdComponents.length - 1) {
    currentSectionIndex = 0;
  } else {
    currentSectionIndex++;
  }
  // console.log(hhdComponents[currentSectionIndex]);
  hhdComponents[currentSectionIndex].focus();
}
