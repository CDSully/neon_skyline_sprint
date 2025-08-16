import { Mulberry32 } from "./rng"

interface Obstacle {
  type: string
  lane: number
  y: number
  bounds: { left: number; right: number; top: number; bottom: number }
}

interface SpawnHistory {
  type: string
  lane: number
  y: number
  time: number
}

export class Spawner {
  private rng: Mulberry32
  private obstacles: Obstacle[] = []
  private lastSpawnY = 0
  private spawnDistance = 200
  private spawnHistory: SpawnHistory[] = []
  private gameStartTime = 0
  private lastMandatoryJumpTime = 0
  private lastAdvancedPatternTime = 0

  private readonly SAFE_START_MS = 2000
  private readonly SAFE_OBSTACLE_TYPES = ["BLOCK", "SLOW_ROLLER", "OVERHEAD_BEAM"]
  private readonly UNSAFE_OBSTACLE_TYPES = ["GAP", "MOVING_DRONE", "ZIGZAG_GATE"]

  constructor(isDailyMode = false) {
    const seed = isDailyMode ? this.getDailySeed() : Math.floor(Math.random() * 1000000)
    this.rng = new Mulberry32(seed)
    this.gameStartTime = performance.now()
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

    this.obstacles.forEach((obstacle) => {
      obstacle.y -= world.speed * deltaTime // deltaTime is in seconds, world.speed is units/second
    })
  }

  private spawnObstacle(world: any) {
    const time = world.getTime()
    const currentTime = performance.now()
    const timeSinceStart = currentTime - this.gameStartTime

    let obstacleType: string
    if (timeSinceStart < this.SAFE_START_MS) {
      obstacleType = this.selectSafeObstacleType()
    } else {
      obstacleType = this.selectObstacleType(time)
    }

    let lane = Math.floor(this.rng.random() * 3)
    let attempts = 0
    while (attempts < 10 && this.isForbiddenOverlap(obstacleType, lane, world.speed, time)) {
      lane = Math.floor(this.rng.random() * 3)
      attempts++
    }

    if (timeSinceStart < this.SAFE_START_MS) {
      lane = this.ensureSafeLane(lane)
    }

    const obstacle: Obstacle = {
      type: obstacleType,
      lane,
      y: this.lastSpawnY,
      bounds: this.getObstacleBounds(obstacleType, world.getLaneX(lane)),
    }

    this.obstacles.push(obstacle)

    this.spawnHistory.push({
      type: obstacleType,
      lane,
      y: this.lastSpawnY,
      time: currentTime,
    })

    if (this.isMandatoryJump(obstacleType)) {
      this.lastMandatoryJumpTime = currentTime
    }
    if (this.isAdvancedPattern(obstacleType)) {
      this.lastAdvancedPatternTime = currentTime
    }

    // Keep history manageable
    if (this.spawnHistory.length > 20) {
      this.spawnHistory = this.spawnHistory.slice(-10)
    }
  }

  private selectSafeObstacleType(): string {
    const safeTypes = this.SAFE_OBSTACLE_TYPES
    return safeTypes[Math.floor(this.rng.random() * safeTypes.length)]
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

  private isForbiddenOverlap(obstacleType: string, lane: number, speed: number, gameTime: number): boolean {
    const currentTime = performance.now()

    // No two mandatory jumps within timing threshold
    if (this.isMandatoryJump(obstacleType)) {
      const timeSinceLastJump = currentTime - this.lastMandatoryJumpTime
      const minInterval = speed < 9 ? 1100 : 900 // ms
      if (timeSinceLastJump < minInterval) {
        return true
      }
    }

    // No jump + lane switch in same 200ms window
    const recentHistory = this.spawnHistory.filter((h) => currentTime - h.time < 200)
    for (const recent of recentHistory) {
      if (this.isMandatoryJump(recent.type) && recent.lane !== lane) {
        return true
      }
      if (this.isMandatoryJump(obstacleType) && recent.lane !== lane) {
        return true
      }
    }

    // Breather after advanced patterns
    if (this.isAdvancedPattern(obstacleType)) {
      const timeSinceAdvanced = currentTime - this.lastAdvancedPatternTime
      if (timeSinceAdvanced < 1000) {
        // 1000ms breather
        return true
      }
    }

    return false
  }

  private isMandatoryJump(obstacleType: string): boolean {
    return obstacleType === "GAP" || obstacleType === "BLOCK"
  }

  private isAdvancedPattern(obstacleType: string): boolean {
    return obstacleType === "MOVING_DRONE" || obstacleType === "ZIGZAG_GATE"
  }

  private ensureSafeLane(preferredLane: number): number {
    // During safe start, always allow at least the center lane to be clear
    const recentObstacles = this.obstacles.filter((obs) => obs.y > this.lastSpawnY - 400)
    const occupiedLanes = new Set(recentObstacles.map((obs) => obs.lane))

    // If center lane is free, prefer it
    if (!occupiedLanes.has(1)) {
      return 1
    }

    // Otherwise find any free lane
    for (let lane = 0; lane < 3; lane++) {
      if (!occupiedLanes.has(lane)) {
        return lane
      }
    }

    // Fallback to preferred lane if all occupied (shouldn't happen in safe start)
    return preferredLane
  }

  private getObstacleBounds(type: string, x: number) {
    const graceMargin = 0.05 // ~3px at 50px scale

    switch (type) {
      case "BLOCK":
        return {
          left: x - 0.3 + graceMargin,
          right: x + 0.3 - graceMargin,
          top: 0,
          bottom: 1.5 - graceMargin,
        }
      case "GAP":
        return {
          left: x - 0.4 + graceMargin,
          right: x + 0.4 - graceMargin,
          top: -2,
          bottom: 0,
        }
      case "OVERHEAD_BEAM":
        return {
          left: x - 0.4 + graceMargin,
          right: x + 0.4 - graceMargin,
          top: 1.5 + graceMargin,
          bottom: 2.0,
        }
      case "SLOW_ROLLER":
        return {
          left: x - 0.35 + graceMargin,
          right: x + 0.35 - graceMargin,
          top: 0,
          bottom: 1.2 - graceMargin,
        }
      default:
        return {
          left: x - 0.3 + graceMargin,
          right: x + 0.3 - graceMargin,
          top: 0,
          bottom: 1.0 - graceMargin,
        }
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
    this.spawnHistory = []
    this.gameStartTime = performance.now()
    this.lastMandatoryJumpTime = 0
    this.lastAdvancedPatternTime = 0
  }

  private getDailySeed(): number {
    const today = new Date()
    const year = today.getUTCFullYear()
    const month = String(today.getUTCMonth() + 1).padStart(2, "0")
    const day = String(today.getUTCDate()).padStart(2, "0")
    return Number.parseInt(`${year}${month}${day}`)
  }
}
