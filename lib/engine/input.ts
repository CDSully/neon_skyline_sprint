export class InputManager {
  private lastActionTime = 0
  private readonly MIN_INTERVAL = 120 // ms between lane switches

  public onAction?: (action: string) => void

  handleAction(action: string) {
    const now = Date.now()

    // Rate limit lane switches
    if ((action === "LANE_LEFT" || action === "LANE_RIGHT") && now - this.lastActionTime < this.MIN_INTERVAL) {
      return
    }

    this.lastActionTime = now

    if (this.onAction) {
      this.onAction(action)
    }
  }
}
