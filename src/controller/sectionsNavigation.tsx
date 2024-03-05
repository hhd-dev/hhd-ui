let sectionButtons: HTMLElement[] = [];

let currentSectionIndex = 0;

export const registerSectionElement = (el: any) => {
  sectionButtons.push(el);
};

export const resetSectionElements = () => {
  sectionButtons = [];
  currentSectionIndex = 0;
};

export function prevItemOriginal() {
  if (currentSectionIndex === 0) {
    currentSectionIndex = sectionButtons.length - 1;
  } else {
    currentSectionIndex--;
  }
  sectionButtons[currentSectionIndex].focus();
}

export function nextItemOriginal() {
  if (currentSectionIndex == sectionButtons.length - 1) {
    currentSectionIndex = 0;
  } else {
    currentSectionIndex++;
  }
  sectionButtons[currentSectionIndex].focus();
}
