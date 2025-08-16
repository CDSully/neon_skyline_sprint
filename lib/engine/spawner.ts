import { Mulberry32 } from "./rng"

interface Obstacle {
  type: string
  lane: number
  y: number
  bounds: { left: number; right: number; top: number; bottom: number }
}

export class Spawner {
  private rng: Mulberry32
  private obstacles: Obstacle[] = []
  private lastSpawnY = 0
  private spawnDistance = 200

  constructor(isDailyMode = false) {
    const seed = isDailyMode ? this.getDailySeed() : Math.floor(Math.random() * 1000000)
    this.rng = new Mulberry32(seed)
    console.log("[v0] Spawner initialized with seed:", seed)
  }

  update(deltaTime: number, world: any) {
    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter((obstacle) => obstacle.y > -500)

    // Spawn new obstacles
    if (this.lastSpawnY < world.getTime() * world.speed + 1000) {
      this.spawnObstacle(world)
      this.lastSpawnY += this.spawnDistance
    }

    // Move obstacles
    this.obstacles.forEach((obstacle) => {
      obstacle.y -= (world.speed * deltaTime) / 16.67 // Normalize to 60fps
    })
  }

  private spawnObstacle(world: any) {
    const time = world.getTime()
    const obstacleType = this.selectObstacleType(time)
    const lane = Math.floor(this.rng.random() * 3)

    const obstacle: Obstacle = {
      type: obstacleType,
      lane,
      y: this.lastSpawnY,
      bounds: this.getObstacleBounds(obstacleType, world.getLaneX(lane)),
    }

    this.obstacles.push(obstacle)
  }

  private selectObstacleType(time: number): string {
    const types = ["BLOCK", "GAP", "OVERHEAD_BEAM", "SLOW_ROLLER"]

    // Simple time-based progression
    if (time < 20) {
      return types[Math.floor(this.rng.random() * 2)] // Only BLOCK and GAP
    } else if (time < 60) {
      return types[Math.floor(this.rng.random() * 3)] // Add OVERHEAD_BEAM
    } else {
      return types[Math.floor(this.rng.random() * types.length)] // All types
    }
  }

  private getObstacleBounds(type: string, x: number) {
    switch (type) {
      case "BLOCK":
        return { left: x - 0.3, right: x + 0.3, top: 0, bottom: 1.5 }
      case "GAP":
        return { left: x - 0.4, right: x + 0.4, top: -2, bottom: 0 }
      case "OVERHEAD_BEAM":
        return { left: x - 0.4, right: x + 0.4, top: 1.5, bottom: 2.0 }
      case "SLOW_ROLLER":
        return { left: x - 0.35, right: x + 0.35, top: 0, bottom: 1.2 }
      default:
        return { left: x - 0.3, right: x + 0.3, top: 0, bottom: 1.0 }
    }
  }

  getObstacles(): Obstacle[] {
    return this.obstacles
  }

  render(renderer: any) {
    const ctx = renderer.ctx
    if (!ctx) return

    this.obstacles.forEach((obstacle) => {
      const screenX = renderer.width / 2 + obstacle.bounds.left * 50
      const screenY = renderer.height * 0.7 - obstacle.y * 0.5
      const width = (obstacle.bounds.right - obstacle.bounds.left) * 50
      const height = (obstacle.bounds.bottom - obstacle.bounds.top) * 50

      ctx.save()

      // Color based on obstacle type
      switch (obstacle.type) {
        case "BLOCK":
          ctx.fillStyle = "#FF3355"
          break
        case "GAP":
          ctx.fillStyle = "#000000"
          break
        case "OVERHEAD_BEAM":
          ctx.fillStyle = "#FF4DA6"
          break
        case "SLOW_ROLLER":
          ctx.fillStyle = "#7A5CFF"
          break
        default:
          ctx.fillStyle = "#FF3355"
      }

      ctx.fillRect(screenX, screenY - height, width, height)
      ctx.restore()
    })
  }

  reset() {
    this.obstacles = []
    this.lastSpawnY = 0
  }

  private getDailySeed(): number {
    const today = new Date()
    const year = today.getUTCFullYear()
    const month = String(today.getUTCMonth() + 1).padStart(2, "0")
    const day = String(today.getUTCDate()).padStart(2, "0")
    return Number.parseInt(`${year}${month}${day}`)
  }
}
