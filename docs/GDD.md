# Neon Skyline Sprint - Game Design Document

## Core Concept

**Genre**: Endless Runner  
**Platform**: Web (Desktop + Mobile)  
**Target**: 60 FPS, <250KB bundle, offline-capable  
**Aesthetic**: Vaporwave neon with 2.5D parallax skyline  

## Gameplay Loop

1. **Survive** while running forward automatically
2. **Switch lanes** (3 lanes) to avoid obstacles
3. **Jump/slide** to navigate vertical obstacles
4. **Collect shards** for points and currency
5. **Activate power-ups** for temporary advantages
6. **Chain perfect dodges** to build score multiplier
7. **Achieve high scores** in normal or daily runs

## Core Mechanics

### Movement System
- **3 Lanes**: Left (-2.4u), Center (0u), Right (+2.4u)
- **Lane Switching**: 100ms tween with cubic easing
- **Jump Arc**: 480ms apex time, 3.8u height, realistic gravity
- **Slide**: 620ms duration, reduces collision height by 35%
- **Speed Progression**: 5.0u/s → 14.0u/s over time

### Obstacle Types
1. **Block**: Static barrier requiring lane switch or jump
2. **Gap**: Pit requiring jump to cross safely
3. **Overhead Beam**: Low barrier requiring slide
4. **Moving Drone**: Oscillates between lanes with telegraph
5. **Slow Roller**: Bouncing obstacle teaching timing
6. **Zigzag Gate**: Sequential barriers requiring quick lane changes

### Power-Up System
1. **Shield** (8s): Absorbs one hit, blue glow effect
2. **Magnet** (10s): Attracts shards within 3.5u radius
3. **Slow-Time** (2.8s): Reduces world speed to 65%
4. **Score Rush** (7s): 2.2x multiplier gain rate

### Scoring Formula
- **Distance**: 0.08 points per unit traveled
- **Shards**: 15 points each
- **Perfect Dodges**: 8 points + 1 combo
- **Multiplier**: x1→x2→x3→x4→x5 at combo thresholds [200, 500, 900, 1400]
- **Decay**: -1 combo per 180ms idle, -150 combo on hit

## Difficulty Progression

### Phase System
- **T0 (0-20s)**: Tutorial - Basic blocks and gaps only
- **T1 (20-60s)**: Core - Introduces beams and drones
- **T2 (60-120s)**: Advanced - All obstacle types, complex patterns
- **T3 (120s+)**: Master - Maximum complexity and speed

### Spawn Weights (per 10 rolls)
| Obstacle | T0 | T1 | T2 | T3 |
|----------|----|----|----|----|
| Block | 5 | 3 | 2 | 1 |
| Gap | 2 | 3 | 3 | 3 |
| Overhead Beam | 1 | 1 | 1 | 1 |
| Slow Roller | 2 | 2 | 2 | 1 |
| Moving Drone | 0 | 1 | 1 | 2 |
| Zigzag Gate | 0 | 0 | 1 | 2 |

### Fairness Rules
- Never spawn unavoidable combinations
- Minimum 1.1s between mandatory jumps
- No overlapping jump + lane switch requirements
- Guaranteed breather after intense sequences

## Visual Design

### Color Palette
- **Background**: Deep space grays (#0F1014, #131521)
- **Neon Accents**: Cyan (#3BE4FF), Purple (#7A5CFF), Pink (#FF4DA6)
- **Danger**: Red (#FF3355)
- **UI**: High contrast whites and grays

### Effects System
- **Parallax Skyline**: 5 layers at different scroll speeds
- **Particle Systems**: Pickup bursts, collision sparks, lane streaks
- **Glow Effects**: Two-pass separable blur on light sources
- **Scanlines**: Optional retro CRT effect
- **Performance Tiers**: HIGH/MED/LOW with automatic adjustment

## Audio Design

### Music System
- **Synthesized Loop**: A minor scale, 96-116 BPM progression
- **Instruments**: Sawtooth lead, filtered pads, subtle chorus
- **Dynamic Tempo**: Increases with game speed (capped)

### SFX Library
- **Jump**: Square+sine mix with pitch glide
- **Hit**: Filtered noise burst with band-pass
- **Pickup**: Triad arpeggio with descending steps
- **UI**: Short square wave clicks

## Technical Architecture

### Engine Systems
- **Fixed Timestep Loop**: 60Hz updates with accumulator
- **Input Manager**: Debounced actions with buffering
- **Collision System**: AABB with grace margins
- **Renderer**: Canvas2D with offscreen buffers
- **Audio Engine**: Web Audio API with node graph

### Performance Targets
- **60 FPS**: Primary target on desktop
- **45+ FPS**: Minimum on mobile with auto-adjustment
- **<4ms**: Update step budget
- **<6ms**: Render step budget
- **<250KB**: Main bundle size (gzipped)

### Data Management
- **Local Storage**: Prefixed keys (`nss_v1_`)
- **High Scores**: Normal and daily run tracking
- **Settings**: Audio, visual, accessibility preferences
- **Run History**: Last 5 runs with stats
- **Migration**: Version-aware data structure

## Accessibility Features

### Motor Accessibility
- **Large Touch Targets**: 44px minimum
- **One-Hand Mode**: Bottom-center controls
- **Input Buffering**: Forgives timing precision
- **Rate Limiting**: Prevents accidental double-inputs

### Visual Accessibility
- **High Contrast**: WCAG AA compliant ratios
- **Colorblind Support**: Deuteranopia, protanopia, tritanopia palettes
- **Reduced Motion**: Disables parallax, particles, scanlines
- **Scalable UI**: Respects system font size preferences

### Auditory Accessibility
- **Visual Cues**: All audio has visual equivalents
- **Volume Controls**: Separate music/SFX sliders
- **Mute Options**: Complete audio disable

### Cognitive Accessibility
- **Clear Instructions**: Simple tutorial with skip option
- **Consistent Controls**: Same inputs throughout
- **Pause Anytime**: No pressure to continue
- **Progress Indicators**: Clear score and multiplier display

## Monetization & Privacy

### Privacy-First Design
- **No Data Collection**: Zero analytics or tracking
- **Local Storage Only**: All data stays on device
- **No External Requests**: Completely offline-capable
- **Transparent**: Clear privacy statements in UI

### Progression System
- **Shard Currency**: Earned through gameplay only
- **Cosmetic Unlocks**: Trail effects, color schemes
- **Achievement System**: Local milestones and badges
- **No Monetization**: Pure gameplay experience

## Daily Run System

### Deterministic Seeding
- **Seed Formula**: YYYYMMDD (UTC date)
- **RNG**: Mulberry32 for consistent sequences
- **Fixed Patterns**: Same obstacles for all players
- **Separate Leaderboard**: Local daily best tracking

## Quality Assurance

### Testing Strategy
- **Unit Tests**: Physics, scoring, RNG determinism
- **E2E Tests**: Core gameplay flow, settings persistence
- **Performance Tests**: Frame rate monitoring, memory usage
- **Accessibility Tests**: Keyboard navigation, screen readers

### Browser Support
- **Primary**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallbacks**: Graceful degradation for older browsers

## Launch Metrics

### Success Criteria
- **Technical**: 60 FPS on target devices, <2.5s load time
- **Gameplay**: Average session >60s, completion rate >10%
- **Accessibility**: Full keyboard navigation, screen reader compatible

### Known Limitations
- **WebGL**: Canvas2D primary (performance trade-off)
- **Audio Latency**: Web Audio API limitations on some devices
- **Storage**: 5-10MB localStorage limit (sufficient for game data)

## Future Roadmap (v1.1+)

### Potential Features
1. **Ghost Replays**: Record/playback last run overlay
2. **Cosmetics Editor**: Custom trail colors and effects
3. **Weekly Challenges**: Fixed 90s time attack courses
4. **Photo Mode**: Enhanced screenshot capture with filters
5. **Leaderboard Integration**: Optional online score sharing

### Technical Improvements
- **WebGL Renderer**: Higher performance on capable devices
- **Service Worker**: Enhanced offline caching
- **WebAssembly**: Core game loop optimization
- **Gamepad Support**: Controller input for accessibility

---

*This GDD represents the v1.0 specification. All mechanics and values are subject to playtesting and balance adjustments.*
