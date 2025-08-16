export class EffectsManager {
  private particles: any[] = []

  update(deltaTime: number) {
    // Update particles
    this.particles = this.particles.filter((particle) => {
      particle.life -= deltaTime
      particle.x += (particle.vx * deltaTime) / 1000
      particle.y += (particle.vy * deltaTime) / 1000
      particle.alpha = particle.life / particle.maxLife
      return particle.life > 0
    })
  }

  addPickupEffect(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        life: 500,
        maxLife: 500,
        alpha: 1,
        color: "#3BE4FF",
      })
    }
  }

  addCollisionEffect(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 300,
        vy: (Math.random() - 0.5) * 300,
        life: 800,
        maxLife: 800,
        alpha: 1,
        color: "#FF3355",
      })
    }
  }

  getParticleCount(): number {
    return this.particles.length
  }

  render(renderer: any) {
    const ctx = renderer.ctx
    if (!ctx) return

    ctx.save()
    this.particles.forEach((particle) => {
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      const screenX = renderer.width / 2 + particle.x
      const screenY = renderer.height * 0.7 - particle.y
      ctx.fillRect(screenX - 2, screenY - 2, 4, 4)
    })
    ctx.restore()
  }

  clear() {
    this.particles = []
  }
}
