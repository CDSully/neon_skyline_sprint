export class GameLoop {
  private animationId: number | null = null
  private lastTime = 0
  private accumulator = 0
  private readonly FIXED_STEP = 1000 / 60 // 16.67ms
  private readonly MAX_STEPS = 5
  private running = false

  constructor(
    private updateFn: (deltaTime: number) => void,
    private renderFn: () => void,
  ) {}

  start() {
    if (this.running) return

    this.running = true
    this.lastTime = performance.now()
    this.accumulator = 0
    this.tick()
  }

  pause() {
    this.running = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  resume() {
    if (this.running) return

    this.running = true
    this.lastTime = performance.now()
    this.accumulator = 0
    this.tick()
  }

  stop() {
    this.pause()
  }

  private tick = () => {
    if (!this.running) return

    const currentTime = performance.now()
    let deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Clamp delta time to prevent spiral of death
    deltaTime = Math.min(deltaTime, 200)
    this.accumulator += deltaTime

    // Fixed timestep updates
    let steps = 0
    while (this.accumulator >= this.FIXED_STEP && steps < this.MAX_STEPS) {
      this.updateFn(this.FIXED_STEP)
      this.accumulator -= this.FIXED_STEP
      steps++
    }

    // Render
    this.renderFn()

    this.animationId = requestAnimationFrame(this.tick)
  }
}
