import Component from "classes/Component"

export default class Reveal extends Component {
  constructor(params) {
    super(params)
    this.threshold = params.threshold || 0.15
    this.unobserve = params.unobserve ?? true
    this.params = params
    this.createObserver()
  }

  createObserver() {
    const options = { threshold: this.threshold }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target
          this.dispatchEvent({
            type: "in",
            index: entry.target.getAttribute("data-slide"),
            target: el,
          })
          if (!this.params.keep) this.observer.unobserve(entry.target)
        } else {
          const el = entry.target
          this.dispatchEvent({
            type: "out",
            index: entry.target.getAttribute("data-slide"),
            target: el,
          })
        }
      })
    }, options)

    Object.entries(this.elements).forEach(([key, value]) => {
      if (value.forEach) {
        value.forEach((element) => {
          this.observer.observe(element)
        })
      } else this.observer.observe(value)
    })
  }
}
