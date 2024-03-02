const sectionButtons: HTMLElement[] = [];

let currentSectionIndex = 0;

export const navigateSections = (gp: Gamepad) => {
  const LButton = gp.buttons[4];
  const RButton = gp.buttons[5];

  try {
    if (LButton.pressed) {
      //   console.log("l pressed");
      prevItem();
    }
    if (RButton.pressed) {
      //   console.log("r pressed");
      nextItem();
    }
  } catch (e) {
    console.error("error while listening for section buttons", e);
  }
};

export const registerSectionElement = (el: any) => {
  sectionButtons.push(el);
};

function prevItem() {
  if (currentSectionIndex === 0) {
    currentSectionIndex = sectionButtons.length - 1;
  } else {
    currentSectionIndex--;
  }
  console.log(currentSectionIndex);
  sectionButtons[currentSectionIndex].focus();
}

function nextItem() {
  if (currentSectionIndex == sectionButtons.length - 1) {
    currentSectionIndex = 0;
  } else {
    currentSectionIndex++;
  }
  console.log(currentSectionIndex);

  sectionButtons[currentSectionIndex].focus();
}
