import { Player } from "../lib/engine/player"

function testPhysics() {
  console.log("[v0] Testing physics calculations...")

  const player = new Player()
  const mockWorld = {
    getLaneX: (lane: number) => [-2.4, 0, 2.4][lane] || 0,
  }

  // Test jump physics
  player.jump()

  let jumpTime = 0
  let maxHeight = 0
  let landingTime = 0

  // Simulate jump for 1 second
  for (let i = 0; i < 60; i++) {
    // 60 frames at 16.67ms each
    const deltaTime = 1 / 60 // 1/60 second per frame
    player.update(deltaTime, mockWorld)

    jumpTime += deltaTime
    if (player.y > maxHeight) {
      maxHeight = player.y
    }

    // Check if landed
    if (player.y <= 0 && jumpTime > 0.1) {
      landingTime = jumpTime
      break
    }
  }

  // Expected values based on physics constants
  const expectedApexTime = 0.48 // seconds
  const expectedHeight = 3.8
  const expectedLandingTime = expectedApexTime * 2 // ~0.96s

  const apexTimeError = Math.abs(jumpTime - expectedApexTime)
  const heightError = Math.abs(maxHeight - expectedHeight)
  const landingError = Math.abs(landingTime - expectedLandingTime)

  console.log(
    "[v0] Jump apex time:",
    jumpTime.toFixed(3),
    "s (expected:",
    expectedApexTime,
    "s, error:",
    apexTimeError.toFixed(3),
    "s)",
  )
  console.log(
    "[v0] Max height:",
    maxHeight.toFixed(2),
    "(expected:",
    expectedHeight,
    ", error:",
    heightError.toFixed(2),
    ")",
  )
  console.log(
    "[v0] Landing time:",
    landingTime.toFixed(3),
    "s (expected:",
    expectedLandingTime,
    "s, error:",
    landingError.toFixed(3),
    "s)",
  )

  // Test slide collision bounds
  player.reset()
  player.slide()
  player.update(1 / 60, mockWorld)

  const slideBounds = player.getBounds()
  const expectedSlideHeight = 0.65 // 35% reduction from 1.0
  const slideHeightError = Math.abs(slideBounds.bottom - slideBounds.top - expectedSlideHeight)

  console.log(
    "[v0] Slide height:",
    (slideBounds.bottom - slideBounds.top).toFixed(2),
    "(expected:",
    expectedSlideHeight,
    ", error:",
    slideHeightError.toFixed(3),
    ")",
  )

  return {
    apexTimeError: apexTimeError < 0.02,
    heightError: heightError < 0.02,
    landingError: landingError < 0.02,
    slideHeightError: slideHeightError < 0.01,
  }
}

// Run test
const result = testPhysics()
console.log("[v0] Physics test results:", result)
