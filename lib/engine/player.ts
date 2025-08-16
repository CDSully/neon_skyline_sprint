export class Player {
  public x = 0 // Current lane (0 = center)
  public y = 0 // Height above ground
  public lane = 1 // Lane index (0, 1, 2)

  private state: "IDLE" | "RUN" | "JUMP_ASCENT" | "JUMP_DESCENT" | "SLIDE" | "HIT_INVULN" = "RUN"
  private verticalVel = 0
  private jumpTime = 0
  private slideTime = 0
  private invulnTime = 0
  private laneSwitchTime = 0
  private targetLane = 1

  private startInvulnUntil = 0

  private readonly gravity = 32.9
  private readonly jumpHeight = 3.8
  private readonly apexTime = 0.48
  private readonly slideDuration = 620
  private readonly laneSwitchDuration = 100

  update(deltaTime: number, world: any) {
    const dtSec = deltaTime // Already in seconds from new loop system

    // Update lane switching
    if (this.laneSwitchTime > 0) {
      this.laneSwitchTime -= deltaTime * 1000 // Convert to ms for internal timing
      const progress = 1 - this.laneSwitchTime / this.laneSwitchDuration
      const eased = this.easeInOutCubic(Math.min(1, progress))
      this.x = this.lerp(world.getLaneX(this.lane), world.getLaneX(this.targetLane), eased)

      if (this.laneSwitchTime <= 0) {
        this.lane = this.targetLane
        this.x = world.getLaneX(this.lane)
      }
    }

    // Update vertical movement
    switch (this.state) {
      case "JUMP_ASCENT":
      case "JUMP_DESCENT":
        this.jumpTime += deltaTime * 1000 // Convert to ms for internal timing
        this.y = this.calculateJumpHeight(this.jumpTime)
        this.verticalVel = this.calculateJumpVelocity(this.jumpTime)

        if (this.y <= 0 && this.verticalVel >= 0) {
          this.y = 0
          this.verticalVel = 0
          this.state = "RUN"
        } else if (this.verticalVel < 0) {
          this.state = "JUMP_DESCENT"
        }
        break

      case "SLIDE":
        this.slideTime -= deltaTime * 1000 // Convert to ms for internal timing
        if (this.slideTime <= 0) {
          this.state = "RUN"
        }
        break

      case "HIT_INVULN":
        this.invulnTime -= deltaTime * 1000 // Convert to ms for internal timing
        if (this.invulnTime <= 0) {
          this.state = "RUN"
        }
        break
    }
  }

  switchLane(direction: number) {
    if (this.laneSwitchTime > 0) return // Already switching

    const newLane = Math.max(0, Math.min(2, this.lane + direction))
    if (newLane === this.lane) return

    this.targetLane = newLane
    this.laneSwitchTime = this.laneSwitchDuration
  }

  jump() {
    if (this.state === "RUN" || this.state === "SLIDE") {
      this.state = "JUMP_ASCENT"
      this.jumpTime = 0
      this.verticalVel = Math.sqrt(2 * this.gravity * this.jumpHeight)
    }
  }

  slide() {
    if (this.state === "RUN") {
      this.state = "SLIDE"
      this.slideTime = this.slideDuration
    }
  }

  setInvulnerable(duration: number) {
    this.state = "HIT_INVULN"
    this.invulnTime = duration
  }

  setStartInvulnerable() {
    this.startInvulnUntil = performance.now() + 1500 // 1500ms start invulnerability
  }

  isInvulnerable(): boolean {
    const now = performance.now()
    return this.state === "HIT_INVULN" || now < this.startInvulnUntil
  }

  getBounds() {
    const width = this.state === "SLIDE" ? 0.8 : 0.6
    const height = this.state === "SLIDE" ? 0.65 : 1.0 // Was 0.4, now 0.65 (35% reduction from 1.0)

    return {
      left: this.x - width / 2,
      right: this.x + width / 2,
      top: this.y,
      bottom: this.y + height,
    }
  }

  render(renderer: any) {
    // Simple player representation
    const ctx = renderer.ctx
    if (!ctx) return

    ctx.save()

    // Convert world coordinates to screen coordinates
    const screenX = renderer.width / 2 + this.x * 50
    const screenY = renderer.height * 0.7 - this.y * 50

    // Player color based on state
    let color = "#3BE4FF" // Cyan
    if (this.state === "HIT_INVULN" || performance.now() < this.startInvulnUntil) {
      color = this.invulnTime % 200 < 100 ? "#3BE4FF" : "#FF4DA6" // Flashing
    } else if (this.state === "SLIDE") {
      color = "#7A5CFF" // Purple
    }

    ctx.fillStyle = color
    ctx.fillRect(screenX - 15, screenY - 30, 30, this.state === "SLIDE" ? 15 : 30)

    ctx.restore()
  }

  reset() {
    this.x = 0
    this.y = 0
    this.lane = 1
    this.state = "RUN"
    this.verticalVel = 0
    this.jumpTime = 0
    this.slideTime = 0
    this.invulnTime = 0
    this.laneSwitchTime = 0
    this.targetLane = 1
    this.setStartInvulnerable()
  }

  private calculateJumpHeight(time: number): number {
    const t = time / 1000
    return Math.max(0, this.verticalVel * t - 0.5 * this.gravity * t * t)
  }

  private calculateJumpVelocity(time: number): number {
    const t = time / 1000
    return this.verticalVel - this.gravity * t
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }
}
