import LongPage from "classes/LongPage";

export default class Home extends LongPage {
  constructor() {
    super({
      element: ".home",
      id: "home",
      elements: {},
    });
  }

  /** Life Cycle */
  create() {
    super.create();
    this.reCalculate({ scroll: {} });
  }
  reCalculate() {
    super.reCalculate({ scroll: {} });
  }
}
