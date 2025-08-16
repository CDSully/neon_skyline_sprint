export class InputManager {
  private lastActionTime = 0
  private lastLaneSwitchTime = 0
  private queuedLaneSwitch: string | null = null
  private lastSlideTime = 0

  private readonly MIN_LANE_INTERVAL = 120 // ms between lane switches
  private readonly SLIDE_COOLDOWN = 300 // ms slide cooldown
  private readonly COYOTE_TIME = 85 // ms pre-ground jump buffer
  private readonly JUMP_BUFFER = 90 // ms jump buffer window

  public onAction?: (action: string) => void

  handleAction(action: string) {
    const now = Date.now()

    if (action === "LANE_LEFT" || action === "LANE_RIGHT") {
      if (now - this.lastLaneSwitchTime < this.MIN_LANE_INTERVAL) {
        // Queue the switch for later execution
        this.queuedLaneSwitch = action
        return
      }
      this.lastLaneSwitchTime = now
      this.queuedLaneSwitch = null
    }

    if (action === "SLIDE") {
      if (now - this.lastSlideTime < this.SLIDE_COOLDOWN) {
        return
      }
      this.lastSlideTime = now
    }

    this.lastActionTime = now

    if (this.onAction) {
      this.onAction(action)
    }
  }

  update(deltaTime: number) {
    const now = Date.now()

    // Execute queued lane switch if cooldown has passed
    if (this.queuedLaneSwitch && now - this.lastLaneSwitchTime >= this.MIN_LANE_INTERVAL) {
      this.lastLaneSwitchTime = now
      if (this.onAction) {
        this.onAction(this.queuedLaneSwitch)
      }
      this.queuedLaneSwitch = null
    }
  }
}
