export class Renderer {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private width: number
  private height: number
  private pixelRatio: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    this.resize()
    window.addEventListener("resize", this.resize.bind(this))
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height

    this.canvas.width = this.width * this.pixelRatio
    this.canvas.height = this.height * this.pixelRatio

    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    this.ctx.scale(this.pixelRatio, this.pixelRatio)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  drawBackground(world: any) {
    // Neon gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, "#0F1014")
    gradient.addColorStop(0.5, "#131521")
    gradient.addColorStop(1, "#0F1014")

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Parallax city layers
    this.drawCityLayer(0.2, "#3BE4FF", 0.1)
    this.drawCityLayer(0.4, "#7A5CFF", 0.15)
    this.drawCityLayer(0.6, "#FF4DA6", 0.2)
  }

  private drawCityLayer(parallaxSpeed: number, color: string, alpha: number) {
    this.ctx.save()
    this.ctx.globalAlpha = alpha
    this.ctx.fillStyle = color

    // Simple building silhouettes
    const buildingCount = 8
    const buildingWidth = this.width / buildingCount

    for (let i = 0; i < buildingCount; i++) {
      const height = Math.random() * this.height * 0.4 + this.height * 0.2
      const x = (i * buildingWidth) % this.width
      const y = this.height - height

      this.ctx.fillRect(x, y, buildingWidth - 2, height)

      // Windows
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

    this.ctx.restore()
  }

  present() {
    // Final presentation step
  }

  destroy() {
    window.removeEventListener("resize", this.resize.bind(this))
  }
}
