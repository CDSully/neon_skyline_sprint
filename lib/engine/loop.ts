const STEP_MS = 1000 / 60
const STEP_S = STEP_MS / 1000
let raf = 0
let running = false
let last = 0
let acc = 0
const MAX_ACC_MS = 200

export function start(update: (dtSec: number) => void, draw: (alpha: number) => void) {
  if (running) return
  running = true
  last = performance.now()
  acc = 0
  const frame = (now: number) => {
    if (!running) return
    let delta = now - last
    if (delta < 0 || delta > 1000) delta = STEP_MS // guard weird deltas
    acc += Math.min(delta, MAX_ACC_MS) // clamp spikes (resume/tab switch)
    last = now
    while (acc >= STEP_MS) {
      update(STEP_S) // ALWAYS seconds
      acc -= STEP_MS
    }
    draw(acc / STEP_MS) // alpha in [0..1]
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
}

export function stop() {
  if (!running) return
  running = false
  cancelAnimationFrame(raf)
}

export function onVisibilityChange() {
  if (document.visibilityState === "visible") {
    last = performance.now()
    acc = 0
  }
}

// Set up visibility change listener
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", onVisibilityChange)
}

// Legacy GameLoop class for backward compatibility
export class GameLoop {
  private updateFn: (deltaTime: number) => void
  private renderFn: () => void

  constructor(updateFn: (deltaTime: number) => void, renderFn: () => void) {
    this.updateFn = updateFn
    this.renderFn = renderFn
  }

  start() {
    start(
      (dtSec) => this.updateFn(dtSec * 1000), // Convert back to ms for legacy compatibility
      () => this.renderFn(),
    )
  }

  pause() {
    stop()
  }

  resume() {
    this.start()
  }

  stop() {
    stop()
  }
}
