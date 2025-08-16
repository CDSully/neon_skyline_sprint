export class Renderer {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private width: number
  private height: number
  private pixelRatio: number
  private effectiveDpr: number
  private performanceTier: "HIGH" | "MEDIUM" | "LOW" = "HIGH"

  private frameCount = 0
  private lastFpsUpdate = 0
  private currentFps = 60
  private fpsHistory: number[] = []
  private droppedFrames = 0
  private lastFrameTime = 0
  private objectsDrawn = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const maxDpr = isMobile ? 2.0 : 2.5
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, maxDpr)
    this.effectiveDpr = this.pixelRatio

    this.resize()
    window.addEventListener("resize", this.resize.bind(this))
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height

    this.canvas.width = Math.round(this.width * this.effectiveDpr)
    this.canvas.height = Math.round(this.height * this.effectiveDpr)

    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    this.ctx.setTransform(this.effectiveDpr, 0, 0, this.effectiveDpr, 0, 0)
  }

  startFrame() {
    this.frameCount++
    this.objectsDrawn = 0
    const now = performance.now()

    if (this.lastFrameTime > 0) {
      const frameDelta = now - this.lastFrameTime
      if (frameDelta > 20) {
        // Frame took longer than ~50fps
        this.droppedFrames++
      }
    }
    this.lastFrameTime = now

    // Update FPS every second
    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate))
      this.fpsHistory.push(this.currentFps)
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift()
      }

      // Auto-tier performance adjustment
      this.checkPerformanceAndAdjust()

      this.frameCount = 0
      this.lastFpsUpdate = now
    }
  }

  private checkPerformanceAndAdjust() {
    if (this.fpsHistory.length < 3) return

    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length

    // If avg FPS < 45 for 3+ seconds, drop tier and reduce DPR
    if (avgFps < 45 && this.fpsHistory.length >= 3) {
      if (this.performanceTier === "HIGH") {
        this.performanceTier = "MEDIUM"
        this.effectiveDpr = Math.max(this.effectiveDpr - 0.25, 1.0)
        this.resize()
        console.log("[v0] Performance tier dropped to MEDIUM, DPR:", this.effectiveDpr)
      } else if (this.performanceTier === "MEDIUM") {
        this.performanceTier = "LOW"
        this.effectiveDpr = Math.max(this.effectiveDpr - 0.25, 1.0)
        this.resize()
        console.log("[v0] Performance tier dropped to LOW, DPR:", this.effectiveDpr)
      }
      // Reset history after adjustment
      this.fpsHistory = []
    }
  }

  getPerformanceStats() {
    return {
      fps: this.currentFps,
      effectiveDpr: this.effectiveDpr,
      performanceTier: this.performanceTier,
      droppedFrames: this.droppedFrames,
      objectsDrawn: this.objectsDrawn,
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  drawBackground(world: any) {
    this.objectsDrawn++

    // Neon gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, "#0F1014")
    gradient.addColorStop(0.5, "#131521")
    gradient.addColorStop(1, "#0F1014")

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)

    const layerCount = this.performanceTier === "HIGH" ? 3 : this.performanceTier === "MEDIUM" ? 2 : 1

    if (layerCount >= 1) this.drawCityLayer(0.2, "#3BE4FF", 0.1)
    if (layerCount >= 2) this.drawCityLayer(0.4, "#7A5CFF", 0.15)
    if (layerCount >= 3) this.drawCityLayer(0.6, "#FF4DA6", 0.2)
  }

  private drawCityLayer(parallaxSpeed: number, color: string, alpha: number) {
    this.ctx.save()
    this.ctx.globalAlpha = alpha
    this.ctx.fillStyle = color

    const buildingCount = this.performanceTier === "HIGH" ? 8 : this.performanceTier === "MEDIUM" ? 6 : 4
    const buildingWidth = this.width / buildingCount

    for (let i = 0; i < buildingCount; i++) {
      const height = Math.random() * this.height * 0.4 + this.height * 0.2
      const x = (i * buildingWidth) % this.width
      const y = this.height - height

      this.ctx.fillRect(x, y, buildingWidth - 2, height)

      if (this.performanceTier === "HIGH") {
        this.ctx.fillStyle = color
        this.ctx.globalAlpha = alpha * 0.5
        for (let row = 0; row < height / 20; row++) {
          for (let col = 0; col < 3; col++) {
            if (Math.random() > 0.7) {
              this.ctx.fillRect(x + col * 8 + 4, y + row * 20 + 4, 4, 4)
            }
          }
        }
        this.ctx.globalAlpha = alpha
        this.ctx.fillStyle = color
      }
    }

    this.ctx.restore()
  }

  present() {
    // Final presentation step - could add scanlines/glow effects here based on tier
    if (this.performanceTier === "HIGH") {
      // Add subtle scanline effect
      this.ctx.save()
      this.ctx.globalAlpha = 0.02
      this.ctx.fillStyle = "#00FFFF"
      for (let y = 0; y < this.height; y += 4) {
        this.ctx.fillRect(0, y, this.width, 1)
      }
      this.ctx.restore()
    }
  }

  destroy() {
    window.removeEventListener("resize", this.resize.bind(this))
  }
}
