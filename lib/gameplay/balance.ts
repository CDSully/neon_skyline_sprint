// Game balance constants and tuning parameters
export const BALANCE = {
  // Engine constants
  FIXED_STEP: 1000 / 60, // 16.67ms
  MAX_STEPS_PER_FRAME: 5,

  // Speed progression
  BASE_SPEED: 5.0,
  MAX_SPEED: 14.0,
  RAMP_PER_SECOND: 0.0125,

  // Lane system
  LANE_WIDTH: 2.4,
  LANE_POSITIONS: [-2.4, 0, 2.4],
  LANE_SWITCH_TIME: 100, // ms
  MIN_SWITCH_INTERVAL: 120, // ms

  // Jump mechanics
  APEX_TIME: 0.48, // seconds
  JUMP_HEIGHT: 3.8,
  GRAVITY: 32.9, // calculated from height and apex time
  BUFFER_WINDOW: 90, // ms
  COYOTE_TIME: 85, // ms

  // Slide mechanics
  SLIDE_DURATION: 620, // ms
  SLIDE_COOLDOWN: 300, // ms
  SLIDE_HEIGHT_REDUCTION: 0.35, // 35% height reduction

  // Invulnerability
  HIT_INVULN_TIME: 720, // ms
  SHIELD_FLASH_FREQUENCY: 7, // Hz

  // Scoring
  DISTANCE_RATE: 0.08, // points per unit traveled
  SHARD_VALUE: 15,
  PERFECT_DODGE_VALUE: 8,
  COMBO_INCREMENT: 1,

  // Multiplier system
  MULTIPLIER_THRESHOLDS: [200, 500, 900, 1400], // combo points for x2, x3, x4, x5
  MULTIPLIER_DECAY_RATE: 1 / 180, // combo lost per ms idle
  HIT_COMBO_PENALTY: 150, // combo lost on hit

  // Power-ups
  POWER_UP_MIN_SPACING: 6000, // ms between power-ups
  SHIELD_DURATION: 8000, // ms
  MAGNET_DURATION: 10000, // ms
  MAGNET_RADIUS: 3.5,
  SLOW_TIME_DURATION: 2800, // ms
  SLOW_TIME_FACTOR: 0.65,
  SCORE_RUSH_DURATION: 7000, // ms
  SCORE_RUSH_MULTIPLIER: 2.2,

  // Spawn weights by phase (per 10 rolls)
  SPAWN_WEIGHTS: {
    T0: {
      // 0-20s
      BLOCK: 5,
      GAP: 2,
      SLOW_ROLLER: 2,
      OVERHEAD_BEAM: 1,
      MOVING_DRONE: 0,
      ZIGZAG_GATE: 0,
    },
    T1: {
      // 20-60s
      BLOCK: 3,
      GAP: 3,
      SLOW_ROLLER: 2,
      OVERHEAD_BEAM: 1,
      MOVING_DRONE: 1,
      ZIGZAG_GATE: 0,
    },
    T2: {
      // 60-120s
      BLOCK: 2,
      GAP: 3,
      SLOW_ROLLER: 2,
      OVERHEAD_BEAM: 1,
      MOVING_DRONE: 1,
      ZIGZAG_GATE: 1,
    },
    T3: {
      // 120s+
      BLOCK: 1,
      GAP: 3,
      SLOW_ROLLER: 1,
      OVERHEAD_BEAM: 1,
      MOVING_DRONE: 2,
      ZIGZAG_GATE: 2,
    },
  },

  // Performance tiers
  PERFORMANCE_TIERS: {
    HIGH: {
      PICKUP_PARTICLES: 16,
      COLLISION_PARTICLES: 40,
      LANE_STREAKS: 5,
      GLOW_ENABLED: true,
      SCANLINE_ENABLED: true,
    },
    MEDIUM: {
      PICKUP_PARTICLES: 10,
      COLLISION_PARTICLES: 24,
      LANE_STREAKS: 3,
      GLOW_ENABLED: true,
      SCANLINE_ENABLED: false,
    },
    LOW: {
      PICKUP_PARTICLES: 6,
      COLLISION_PARTICLES: 12,
      LANE_STREAKS: 0,
      GLOW_ENABLED: false,
      SCANLINE_ENABLED: false,
    },
  },
}
