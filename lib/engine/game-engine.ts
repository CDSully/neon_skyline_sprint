import { GameLoop } from "./loop"
import { InputManager } from "./input"
import { Renderer } from "./render"
import { AudioEngine } from "./audio"
import { World } from "./world"
import { Player } from "./player"
import { Spawner } from "./spawner"
import { EffectsManager } from "./effects"
import { GameState } from "./state"

export class GameEngine {
  private loop: GameLoop
  private input: InputManager
  private renderer: Renderer
  private audio: AudioEngine
  private world: World
  private player: Player
  private spawner: Spawner
  private effects: EffectsManager
  private state: GameState

  public onStateUpdate?: (state: any) => void

  constructor(canvas: HTMLCanvasElement, isDailyMode = false) {
    // Initialize core systems
    this.state = new GameState(isDailyMode)
    this.input = new InputManager()
    this.renderer = new Renderer(canvas)
    this.audio = new AudioEngine()
    this.world = new World()
    this.player = new Player()
    this.spawner = new Spawner(isDailyMode)
    this.effects = new EffectsManager()

    // Initialize game loop
    this.loop = new GameLoop(this.update.bind(this), this.render.bind(this))

    // Set up input handling
    this.input.onAction = this.handleInput.bind(this)

    console.log("[v0] Game engine initialized")
  }

  start() {
    this.state.scene = "PLAY"
    this.loop.start()
    this.audio.startMusic()
    console.log("[v0] Game started")
  }

  pause() {
    this.state.scene = "PAUSE"
    this.loop.pause()
    this.audio.pauseMusic()
  }

  resume() {
    this.state.scene = "PLAY"
    this.loop.resume()
    this.audio.resumeMusic()
  }

  restart() {
    this.state.reset()
    this.player.reset()
    this.spawner.reset()
    this.effects.clear()
    this.start()
  }

  destroy() {
    this.loop.stop()
    this.audio.destroy()
    this.renderer.destroy()
  }

  input(action: string) {
    this.input.handleAction(action)
  }

  private handleInput(action: string) {
    switch (action) {
      case "LANE_LEFT":
        this.player.switchLane(-1)
        break
      case "LANE_RIGHT":
        this.player.switchLane(1)
        break
      case "JUMP":
        this.player.jump()
        break
      case "SLIDE":
        this.player.slide()
        break
      case "PAUSE":
        if (this.state.scene === "PLAY") {
          this.pause()
        } else if (this.state.scene === "PAUSE") {
          this.resume()
        }
        break
    }
  }

  private update(deltaTime: number) {
    if (this.state.scene !== "PLAY") return

    // Update game systems
    this.world.update(deltaTime)
    this.player.update(deltaTime, this.world)
    this.spawner.update(deltaTime, this.world)
    this.effects.update(deltaTime)

    // Check collisions
    const obstacles = this.spawner.getObstacles()
    const collision = this.checkCollisions(obstacles)

    if (collision && !this.player.isInvulnerable()) {
      if (this.state.powerUps.shield.active) {
        this.state.powerUps.shield.active = false
        this.player.setInvulnerable(720) // 720ms invulnerability
        this.audio.playHitSound()
      } else {
        this.gameOver()
      }
    }

    // Update score
    this.state.score += Math.floor(this.world.speed * deltaTime * 0.08)

    // Update power-ups
    this.updatePowerUps(deltaTime)

    // Notify UI of state changes
    if (this.onStateUpdate) {
      this.onStateUpdate({
        scene: this.state.scene,
        score: this.state.score,
        multiplier: this.state.multiplier,
        shards: this.state.shards,
        lives: this.state.lives,
        powerUps: this.state.powerUps,
      })
    }
  }

  private render() {
    this.renderer.clear()

    // Render background
    this.renderer.drawBackground(this.world)

    // Render game objects
    this.spawner.render(this.renderer)
    this.player.render(this.renderer)
    this.effects.render(this.renderer)

    this.renderer.present()
  }

  private checkCollisions(obstacles: any[]): boolean {
    const playerBounds = this.player.getBounds()

    for (const obstacle of obstacles) {
      if (this.world.isOnScreen(obstacle) && this.intersects(playerBounds, obstacle.bounds)) {
        return true
      }
    }

    return false
  }

  private intersects(a: any, b: any): boolean {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
  }

  private updatePowerUps(deltaTime: number) {
    Object.keys(this.state.powerUps).forEach((key) => {
      const powerUp = this.state.powerUps[key as keyof typeof this.state.powerUps]
      if (powerUp.active) {
        powerUp.timeLeft -= deltaTime / 1000
        if (powerUp.timeLeft <= 0) {
          powerUp.active = false
          powerUp.timeLeft = 0
        }
      }
    })
  }

  private gameOver() {
    this.state.scene = "GAME_OVER"
    this.loop.pause()
    this.audio.stopMusic()
    this.audio.playGameOverSound()
    console.log("[v0] Game over - final score:", this.state.score)
  }
}
