import { debounce } from "lodash";

let sectionButtons: HTMLElement[] = [];

let currentSectionIndex = 0;

const prevItem = debounce(prevItemOriginal, 70);
const nextItem = debounce(nextItemOriginal, 70);

export const navigateSections = (gp: Gamepad) => {
  const LButton = gp.buttons[4];
  const RButton = gp.buttons[5];

  try {
    if (LButton.pressed) {
      prevItem();
    }
    if (RButton.pressed) {
      nextItem();
    }
  } catch (e) {
    console.error("error while listening for section buttons", e);
  }
};

export const registerSectionElement = (el: any) => {
  sectionButtons.push(el);
};

export const resetSectionElements = () => {
  sectionButtons = [];
  currentSectionIndex = 0;
};

function prevItemOriginal() {
  if (currentSectionIndex === 0) {
    currentSectionIndex = sectionButtons.length - 1;
  } else {
    currentSectionIndex--;
  }
  sectionButtons[currentSectionIndex].focus();
}

function nextItemOriginal() {
  if (currentSectionIndex == sectionButtons.length - 1) {
    currentSectionIndex = 0;
  } else {
    currentSectionIndex++;
  }
  sectionButtons[currentSectionIndex].focus();
}
