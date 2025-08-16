import { Spawner } from "../lib/engine/spawner"

function testSpawnerFairness() {
  console.log("[v0] Testing spawner fairness rules...")

  const spawner = new (Spawner as any)(false)
  const mockWorld = {
    getTime: () => 30, // 30 seconds in
    speed: 7.0,
    getLaneX: (lane: number) => [-2.4, 0, 2.4][lane] || 0,
  }

  let violations = 0
  let totalSpawns = 0
  const spawnHistory: Array<{ type: string; lane: number; time: number }> = []

  // Test 1000 spawn sequences
  for (let i = 0; i < 1000; i++) {
    ;(spawner as any).lastSpawnY = i * 200
    ;(spawner as any).spawnObstacle(mockWorld)

    const obstacles = (spawner as any).obstacles
    if (obstacles.length > 0) {
      const latest = obstacles[obstacles.length - 1]
      const spawnTime = performance.now()
      spawnHistory.push({
        type: latest.type,
        lane: latest.lane,
        time: spawnTime,
      })
      totalSpawns++

      // Check for violations in recent history
      if (spawnHistory.length >= 2) {
        const recent = spawnHistory.slice(-5) // Last 5 spawns

        // Check for jump + lane switch in same window
        for (let j = 0; j < recent.length - 1; j++) {
          const curr = recent[j]
          const next = recent[j + 1]

          const isCurrJump = curr.type === "GAP" || curr.type === "BLOCK"
          const isNextJump = next.type === "GAP" || next.type === "BLOCK"
          const timeDiff = next.time - curr.time
          const laneDiff = Math.abs(next.lane - curr.lane)

          // Violation: jump + lane switch within 200ms
          if ((isCurrJump || isNextJump) && laneDiff > 0 && timeDiff < 200) {
            violations++
          }

          // Violation: two mandatory jumps too close
          if (isCurrJump && isNextJump && timeDiff < 900) {
            violations++
          }
        }
      }
    }
  }

  const violationRate = violations / totalSpawns
  console.log("[v0] Spawner fairness test:", violations, "violations out of", totalSpawns, "spawns")
  console.log("[v0] Violation rate:", (violationRate * 100).toFixed(2), "%")

  return {
    violations,
    totalSpawns,
    violationRate,
    passed: violationRate < 0.01, // Less than 1% violation rate
  }
}

// Run test
const result = testSpawnerFairness()
console.log("[v0] Spawner test results:", result)
