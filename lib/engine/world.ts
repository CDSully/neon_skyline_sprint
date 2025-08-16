export class World {
  public speed = 5.0
  public readonly baseSpeed = 5.0
  public readonly maxSpeed = 14.0
  public readonly rampPerSecond = 0.0125
  public readonly laneWidth = 2.4
  public readonly lanes = [-2.4, 0, 2.4]

  private time = 0

  update(deltaTime: number) {
    this.time += deltaTime / 1000

    // Increase speed over time
    this.speed = Math.min(this.baseSpeed + this.time * this.rampPerSecond, this.maxSpeed)
  }

  getTime(): number {
    return this.time
  }

  getLaneX(laneIndex: number): number {
    return this.lanes[Math.max(0, Math.min(2, laneIndex))]
  }

  isOnScreen(object: any): boolean {
    // Simple screen bounds check
    return object.y > -100 && object.y < 1000 // Placeholder bounds
  }

  reset() {
    this.time = 0
    this.speed = this.baseSpeed
  }
}
