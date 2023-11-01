import Component from "classes/Component";

export default class Navigation extends Component {
  constructor(index) {
    super({
      element: ".nav",
    });
    this.create();
  }

  create() {
    this.reCalculate();
  }

  reCalculate() {
    this.isMobile = innerWidth < 768;
    this.wasMobile = innerWidth < 768;
  }
}
