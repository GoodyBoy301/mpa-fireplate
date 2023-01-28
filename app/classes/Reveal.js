import Component from "classes/Component";
import gsap from "gsap";

export default class Reveal extends Component {
  constructor(params) {
    super(params);
    this.threshold = params.threshold || 0.75;
    this.unobserve = params.unobserve ?? true;
    this.createObserver();
  }

  createObserver() {
    const options = { threshold: this.threshold };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this[entry.getAttribute("data-reveal")](entry.target);
          if (this.unobserve) this.observer.unobserve(entry.target);
          this.observer.unobserve(entry.target);
        } else {
          this[entry.getAttribute("data-reveal") + "Reverse"]?.call(
            this,
            entry.target
          );
        }
      });
    }, options);

    Object.entries(this.elements).forEach(([key, value]) => {
      if (value.forEach) {
        value.forEach((element) => {
          this.observer.observe(element);
        });
      } else this.observer.observe(value);
    });
  }

  curtain(element) {
    gsap.fromTo(
      element,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        autoAlpha: 1,
        scale: 1.05,
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        autoAlpha: 1,
        scale: 1,
        delay: element.getAttribute("data-delay"),
        duration: 0.5,
      }
    );
  }
}
