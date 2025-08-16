export class GameState {
  public scene: "LOADING" | "PLAY" | "PAUSE" | "GAME_OVER" = "LOADING"
  public score = 0
  public multiplier = 1
  public shards = 0
  public lives = 1
  public powerUps = {
    shield: { active: false, timeLeft: 0 },
    magnet: { active: false, timeLeft: 0 },
    slowTime: { active: false, timeLeft: 0 },
    scoreRush: { active: false, timeLeft: 0 },
  }

  constructor(private isDailyMode = false) {}

  reset() {
    this.scene = "LOADING"
    this.score = 0
    this.multiplier = 1
    this.shards = 0
    this.lives = 1
    this.powerUps = {
      shield: { active: false, timeLeft: 0 },
      magnet: { active: false, timeLeft: 0 },
      slowTime: { active: false, timeLeft: 0 },
      scoreRush: { active: false, timeLeft: 0 },
    }
  }
}
