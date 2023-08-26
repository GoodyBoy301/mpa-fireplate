import LongPage from "classes/LongPage"

export default class Four04 extends LongPage {
  constructor() {
    super({
      element: "main",
      id: "404",
      elements: {},
    })
  }

  /** Life Cycle */
  create() {
    super.create()
    this.reCalculate()
  }
}
