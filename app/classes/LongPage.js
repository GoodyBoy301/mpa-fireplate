import Page from "classes/Page"
import NormalizeWheel from "normalize-wheel"
import Prefix from "prefix"
import { clamp, lerp, remToPixel } from "utils/math"
import { ScrollSmoother } from "fsap/all"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/all"
import Reveal from "./Reveal"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default class LongPage extends Page {
  constructor(params) {
    super(params)
    this.headerNavs = document.querySelectorAll(".header__wrapper > *")
    this.slides = document.querySelectorAll("[data-slide]")
  }

  create() {
    super.create()
    this.reCalculate({ scroll: {} })
    this.transformPrefix = Prefix("transform")

    window.scrollTo(0, 0)
    this.reCalculate({ scroll: {} })
    gsap.delayedCall(2, () => this.createReveal())
  }

  createReveal() {
    this.firstReveal = true
    this.reveal = new Reveal({
      elements: {
        slide: "[data-slide]",
      },
    })
    this.reveal.addEventListener("in", this.In.bind(this))
    this.reveal.addEventListener("out", this.Out.bind(this))
  }

  In(x) {
    if (this.firstReveal) {
      this.firstReveal = false
      gsap.utils
        .toArray(this.slides)
        .slice(0, Number(x.index))
        .forEach((el) => {
          this.reveal.observer.unobserve(el)
          el.style.opacity = 1
        })
    } else {
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(
          this.slides[Number(x.index - 1)],
          { opacity: 0 },
          { opacity: 1, duration: 0.75, ease: "ease.out" }
        )
        .fromTo(
          this.slides[Number(x.index - 1)],
          { y: "3.5rem" },
          { y: "0rem", duration: 1.3, ease: "expo" },
          "<"
        )
    }
    this.firstReveal = false
  }

  Out() {}

  update() {
    return;
  }
  destroy() {
    // this.Revealer.observer.disconnect();
  }

  reCalculate() {
    this.isMobile = innerWidth < 768
    this.innerWidth = innerWidth
    this.rem8 = remToPixel(7.5)
    if (this.isMobile) {
      this.scrollSmoother?.scrollTop(0)
      this.scrollSmoother?.kill()
    } else {
      this.scrollSmoother = ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.1,
        NormalizeWheel: true,
        ease: "power2.inout",
        speed: 0.75,
      })
      this.scrollSmoother.scrollTop(0)
      document.body.style.height = document.querySelector(".__app").height
    }
  }


  addEventListeners() {
   
  }
  removeEventListeners() {
   
  }
}
