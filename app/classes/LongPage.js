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
    // this.scroll && this.smoothScroll();
    this.scaleX = lerp(this.scaleX || 1, 1, 0.1)
    this.scaleY = lerp(this.scaleY, 1 || 1, 0.1)
    const clientY = this.headerNavsHover ? this.rem8 : this.clientY
    gsap.to(".cursor", {
      x: this.clientX || this.innerWidth / 2,
      y: clientY || innerHeight / 2,
      opacity: 1,
      duration: 0.3,
      ease: "ease.inout",
    })
    gsap.set(".cursor", {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      opacity: 1,
      duration: 0.2,
      ease: "expo.inout",
    })
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

  onMousewheel(event) {
    const { pixelY } = NormalizeWheel(event)
    const pixel = clamp(0, this.scroll.target + pixelY, this.scroll.limit)
    this.scroll.target = pixel < 0 ? 0 : pixel
  }

  onTouchDown(event) {
    this.isDown = true
    const clientY = event.clientY || event.touches[0]?.clientY
    this.scroll.last.y = clientY
  }

  onTouchMove(event) {
    if (!this.isDown) return
    const clientY = event.clientY || event.touches[0]?.clientY

    if (clientY === this.scroll.last.clientY) return

    this.scroll.last.clientY = clientY

    const client = this.scroll.last.y - clientY
    const pixel = clamp(0, this.scroll.target + client, this.scroll.limit)
    this.scroll.target = pixel < 0 ? 0 : pixel
  }

  onTouchUp() {
    this.isDown = false
  }

  onMouseMove(e) {
    this.scaleX = Math.min(
      (Math.max(1, e.clientX) - this.clientX) / (this.innerWidth / 10) + 1,
      1.5
    )
    this.scaleY = Math.min(
      (Math.max(1, e.clientY) - this.clientY) / (this.innerWidth / 10) + 1,
      1.5
    )
    if (this.scaleX > this.scaleY) this.scaleY = 2 - this.scaleX
    else this.scaleX = 2 - this.scaleY
    this.clientX = Math.max(1, e.clientX)
    this.clientY = Math.max(1, e.clientY)
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMousewheel.bind(this))
    window.addEventListener("touchstart", this.onTouchDown.bind(this))
    window.addEventListener("touchmove", this.onTouchMove.bind(this))
    window.addEventListener("touchend", this.onTouchUp.bind(this))
    return;
    window.addEventListener("mousemove", this.onMouseMove.bind(this))
    this.headerNavs.forEach((el) =>
      el.addEventListener("mouseenter", () => (this.headerNavsHover = true))
    )

    this.headerNavs.forEach((el) =>
      el.addEventListener("mouseleave", () => (this.headerNavsHover = false))
    )
  }
  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMousewheel.bind(this))
    window.removeEventListener("touchstart", this.onTouchDown.bind(this))
    window.removeEventListener("touchmove", this.onTouchMove.bind(this))
    window.removeEventListener("touchend", this.onTouchUp.bind(this))
  }
}
