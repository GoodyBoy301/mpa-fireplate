import {
  CineonToneMapping,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from "three"
import time from "utils/time"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export default class gl {
  constructor(element, ...group) {
    this.element = document.querySelector(element)
    const bounds = this.element.getBoundingClientRect()
    this.bounds = bounds
    this.innerHeight = bounds.height
    this.innerWidth = bounds.width
    this.create()
    this.scene.add(...group)
    this.group = group
    this.controls.enableZoom = false
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.075
  }

  create() {
    this.createRenderer()
    this.createScene()
    this.createCamera()
    this.reCalculate({ scroll: {} })
    this.time = new time()
    this.canvas = this.renderer?.domElement
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.update()
    this.update()
  }

  update() {
    this.controls.update()
    if (this.composer) this.composer.render()
    else this.renderer.render(this.scene, this.camera)
    this.time.update()
    requestAnimationFrame(this.update.bind(this))
  }

  destroy() {}

  reCalculate() {
    this.mouseTracker = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
    }
    const bounds = this.element.getBoundingClientRect()
    this.bounds = bounds
    this.innerHeight = bounds.height
    this.innerWidth = bounds.width
    this.camera.aspect = this.innerWidth / this.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(this.innerWidth, this.innerHeight)
    this.fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(this.fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { height, width }
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.element })
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.setClearColor("#eaecee", 0.0)
    this.renderer.setSize(this.innerWidth, this.innerHeight)
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  }

  createScene() {
    this.scene = new Scene()
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      35,
      this.innerWidth / this.innerHeight,
      0.1,
      100
    )
    this.camera.position.z = 5
    this.scene.add(this.camera)
  }
}
