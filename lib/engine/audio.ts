export class AudioEngine {
  private audioContext: AudioContext | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private masterGain: GainNode | null = null
  private musicOscillator: OscillatorNode | null = null

  constructor() {
    this.initAudio()
  }

  private async initAudio() {
    try {
      this.audioContext = new AudioContext()

      // Create audio graph
      this.masterGain = this.audioContext.createGain()
      this.musicGain = this.audioContext.createGain()
      this.sfxGain = this.audioContext.createGain()

      this.musicGain.connect(this.masterGain)
      this.sfxGain.connect(this.masterGain)
      this.masterGain.connect(this.audioContext.destination)

      // Set initial volumes
      this.musicGain.gain.value = 0.3
      this.sfxGain.gain.value = 0.5
      this.masterGain.gain.value = 0.7

      console.log("[v0] Audio engine initialized")
    } catch (error) {
      console.warn("[v0] Audio initialization failed:", error)
    }
  }

  startMusic() {
    if (!this.audioContext || !this.musicGain) return

    // Simple synth loop
    this.musicOscillator = this.audioContext.createOscillator()
    this.musicOscillator.type = "sawtooth"
    this.musicOscillator.frequency.setValueAtTime(220, this.audioContext.currentTime) // A3

    const musicFilter = this.audioContext.createBiquadFilter()
    musicFilter.type = "lowpass"
    musicFilter.frequency.value = 800

    this.musicOscillator.connect(musicFilter)
    musicFilter.connect(this.musicGain)

    this.musicOscillator.start()
  }

  pauseMusic() {
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(0, this.audioContext!.currentTime)
    }
  }

  resumeMusic() {
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(0.3, this.audioContext!.currentTime)
    }
  }

  stopMusic() {
    if (this.musicOscillator) {
      this.musicOscillator.stop()
      this.musicOscillator = null
    }
  }

  playJumpSound() {
    this.playSFX("square", 440, 0.1, 0.2)
  }

  playHitSound() {
    this.playSFX("sawtooth", 150, 0.3, 0.5)
  }

  playPickupSound() {
    this.playSFX("sine", 880, 0.1, 0.15)
  }

  playGameOverSound() {
    this.playSFX("triangle", 220, 0.5, 1.0)
  }

  private playSFX(type: OscillatorType, frequency: number, duration: number, volume: number) {
    if (!this.audioContext || !this.sfxGain) return

    const oscillator = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    gain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(this.sfxGain)

    oscillator.start()
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}
