import { GameLoop } from "./loop"
import { InputManager } from "./input"
import { Renderer } from "./render"
import { AudioEngine } from "./audio"
import { World } from "./world"
import { Player } from "./player"
import { Spawner } from "./spawner"
import { EffectsManager } from "./effects"
import { GameState } from "./state"
import { PerformanceMonitor } from "./performance-monitor"

export class GameEngine {
  private loop: GameLoop
  private inputManager: InputManager // Renamed from 'input' to 'inputManager' to avoid conflict
  private renderer: Renderer
  private audio: AudioEngine
  private world: World
  private player: Player
  private spawner: Spawner
  private effects: EffectsManager
  private state: GameState
  private perfMonitor: PerformanceMonitor

  public onStateUpdate?: (state: any) => void
  public onPerformanceUpdate?: (stats: any) => void

  constructor(canvas: HTMLCanvasElement, isDailyMode = false) {
    // Initialize core systems
    this.state = new GameState(isDailyMode)
    this.inputManager = new InputManager() // Updated property name
    this.renderer = new Renderer(canvas)
    this.audio = new AudioEngine()
    this.world = new World()
    this.player = new Player()
    this.spawner = new Spawner(isDailyMode)
    this.effects = new EffectsManager()
    this.perfMonitor = new PerformanceMonitor()

    this.loop = new GameLoop(this.update.bind(this), this.render.bind(this))

    // Set up input handling
    this.inputManager.onAction = this.handleInput.bind(this) // Updated property name

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
    this.inputManager.handleAction(action) // Made input method public and ensured it properly delegates to inputManager
  }

  getPerformanceStats() {
    const rendererStats = this.renderer.getPerformanceStats()
    const perfStats = this.perfMonitor.getStats()
    const particleCount = this.effects.getParticleCount ? this.effects.getParticleCount() : 0

    return {
      ...rendererStats,
      ...perfStats,
      particleCount,
      devicePixelRatio: window.devicePixelRatio || 1,
    }
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

    this.perfMonitor.startUpdate()

    const dtSec = deltaTime / 1000

    this.inputManager.update(deltaTime) // Updated property name

    // Update game systems
    this.world.update(deltaTime)
    this.player.update(dtSec, this.world) // Player expects seconds
    this.spawner.update(dtSec, this.world) // Spawner expects seconds
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

    this.state.score += Math.floor(this.world.speed * dtSec * 0.08)

    // Update power-ups
    this.updatePowerUps(deltaTime)

    this.perfMonitor.endUpdate()

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

    if (this.onPerformanceUpdate) {
      this.onPerformanceUpdate(this.getPerformanceStats())
    }
  }

  private render() {
    this.perfMonitor.startDraw()
    this.renderer.startFrame()

    this.renderer.clear()

    // Render background
    this.renderer.drawBackground(this.world)

    // Render game objects
    this.spawner.render(this.renderer)
    this.player.render(this.renderer)
    this.effects.render(this.renderer)

    this.renderer.present()
    this.perfMonitor.endDraw()
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
