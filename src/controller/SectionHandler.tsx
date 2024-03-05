class SectionHandler {
  elements: HTMLElement[];
  idx: number;

  constructor() {
    this.elements = [];
    this.idx = 0;
  }

  register = (el: any) => {
    this.elements.push(el);
  };

  reset = () => {
    this.elements = [];
    this.idx = 0;
  };

  goPrev() {
    if (this.idx <= 0) {
      this.idx = this.elements.length - 1;
    } else {
      this.idx--;
    }
    this.elements[this.idx].focus();
  }

  goNext() {
    if (this.idx >= this.elements.length - 1) {
      this.idx = 0;
    } else {
      this.idx++;
    }
    this.elements[this.idx].focus();
  }
}

export default new SectionHandler();
