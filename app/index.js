import Home from "pages/Home";
import Framework from "classes/Framework";
import Four04 from "pages/404"

class App extends Framework {
  constructor() {
    super();
    requestAnimationFrame(this.update.bind(this));
    window.onunload = () => {
      // scrollTo(0, 0);
      // Canvas?.destroy();
    };
  }

  createPages() {
    this.pages = {
      home: new Home(),
      404: new Four04(),
    };
    this.page = this.pages[this.template] || this.pages["404"]
    this.createRouter();
    window.$app = this
  }

  update() {
    this.page?.update && this.page.update();
    this.canvas?.update();
    requestAnimationFrame(this.update.bind(this));
  }
}

new App();
