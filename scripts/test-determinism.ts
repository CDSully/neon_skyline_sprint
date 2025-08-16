import { Mulberry32 } from "../lib/engine/rng"
import { Spawner } from "../lib/engine/spawner"

// Mock world object for testing
const mockWorld = {
  getTime: () => 0,
  speed: 5.0,
  getLaneX: (lane: number) => [-2.4, 0, 2.4][lane] || 0,
}

function testDeterminism() {
  console.log("[v0] Testing determinism with seed 12345...")

  const spawner = new (Spawner as any)(false) // Bypass daily mode
  // Set specific seed for testing
  const rng = new Mulberry32(12345)
  ;(spawner as any).rng = rng

  const obstacles: string[] = []

  // Generate first 200 obstacles
  for (let i = 0; i < 200; i++) {
    ;(spawner as any).lastSpawnY = i * 200
    ;(spawner as any).spawnObstacle(mockWorld)
    const lastObstacle = (spawner as any).obstacles[(spawner as any).obstacles.length - 1]
    if (lastObstacle) {
      obstacles.push(`${lastObstacle.type}-${lastObstacle.lane}`)
    }
  }

  // Create determinism hash
  const hashInput = obstacles.join(",")
  let hash = 0
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  const deterministicHash = Math.abs(hash).toString(16).substring(0, 8)
  console.log("[v0] Determinism Hash (seed=12345):", deterministicHash)

  return {
    hash: deterministicHash,
    obstacleCount: obstacles.length,
    firstFew: obstacles.slice(0, 10),
  }
}

// Run test
const result = testDeterminism()
console.log("[v0] Test completed:", result)
