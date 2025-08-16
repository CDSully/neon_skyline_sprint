export class PerformanceMonitor {
  private updateTimes: number[] = []
  private drawTimes: number[] = []
  private lastUpdateStart = 0
  private lastDrawStart = 0

  startUpdate() {
    this.lastUpdateStart = performance.now()
  }

  endUpdate() {
    const updateTime = performance.now() - this.lastUpdateStart
    this.updateTimes.push(updateTime)
    if (this.updateTimes.length > 60) {
      this.updateTimes.shift()
    }
  }

  startDraw() {
    this.lastDrawStart = performance.now()
  }

  endDraw() {
    const drawTime = performance.now() - this.lastDrawStart
    this.drawTimes.push(drawTime)
    if (this.drawTimes.length > 60) {
      this.drawTimes.shift()
    }
  }

  getStats() {
    const avgUpdate =
      this.updateTimes.length > 0 ? this.updateTimes.reduce((a, b) => a + b, 0) / this.updateTimes.length : 0
    const avgDraw = this.drawTimes.length > 0 ? this.drawTimes.reduce((a, b) => a + b, 0) / this.drawTimes.length : 0

    return {
      updateMs: avgUpdate,
      drawMs: avgDraw,
    }
  }
}
