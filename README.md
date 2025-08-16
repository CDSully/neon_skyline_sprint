# Neon Skyline Sprint

A polished, high-FPS endless runner in a neon 2.5D skyline. Dodge obstacles across three lanes, chain perfect dodges for multiplier bonuses, collect shards, and activate power-ups while a synthy soundtrack pulses.

## Features

- **6+ Obstacle Types**: Blocks, gaps, overhead beams, moving drones, slow rollers, and zigzag gates
- **4 Power-ups**: Shield (absorb hits), Magnet (attract shards), Slow-Time (reduce world speed), Score Rush (double multiplier gain)
- **Daily Runs**: Deterministic seeded challenges that reset daily
- **Full Accessibility**: Keyboard navigation, screen reader support, colorblind-friendly palettes, reduced motion options
- **Mobile Optimized**: Touch controls with swipe gestures and one-hand mode
- **Performance Tuned**: Auto-adjusting quality settings to maintain 60 FPS
- **Privacy First**: No data collection, works completely offline, all data stored locally

## Controls

### Desktop
- **←/→** or **A/D** - Switch lanes
- **Space** or **W** - Jump
- **S** or **↓** - Slide
- **P** or **Esc** - Pause
- **`** - Toggle performance overlay

### Mobile
- **Left/right zones** - Switch lanes
- **Tap anywhere** - Jump
- **Swipe down** - Slide
- **Pause button** (top-right)

## Settings

- **Audio**: Separate music and SFX volume controls
- **Visual**: Dark/daylight themes, reduced motion support
- **Accessibility**: Colorblind support (deuteranopia, protanopia, tritanopia), one-hand mode
- **Data Management**: Local-only storage with reset option

## Performance Modes

The game automatically adjusts visual quality based on performance:

- **HIGH**: Full particle effects, glow, scanlines (60+ FPS)
- **MEDIUM**: Reduced particles, glow only (45-60 FPS)
- **LOW**: Minimal effects, solid colors (<45 FPS)

## Privacy

- **No external requests**: Everything runs locally in your browser
- **No analytics**: No tracking, cookies, or data collection
- **Local storage only**: High scores and settings stored on your device
- **Offline capable**: Works without internet connection

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to play.

## Modding Hooks

Want to customize the game? Check these files:

- `/lib/gameplay/balance.ts` - Speed curves, spawn weights, scoring
- `/app/globals.css` - Color themes and visual effects
- `/lib/engine/spawner.ts` - Obstacle patterns and difficulty

## Accessibility Highlights

- Full keyboard navigation with logical tab order
- ARIA labels and live regions for screen readers
- High contrast ratios (WCAG AA compliant)
- Colorblind-friendly palettes with shape differentiation
- Reduced motion support for vestibular disorders
- Large touch targets (44px minimum) for motor accessibility

## Troubleshooting

### Audio Issues
If audio doesn't work, try:
1. Click anywhere to enable audio (browser requirement)
2. Check volume settings in the Settings menu
3. Ensure your browser supports Web Audio API

### Low FPS
The game auto-adjusts quality, but you can also:
1. Close other browser tabs
2. Enable reduced motion in Settings
3. Check the performance overlay (backtick key) for diagnostics

## Tech Stack

- **Next.js 15** + **React 18** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Canvas2D** for rendering (WebGL fallback)
- **Web Audio API** for synthesized music and SFX
- **Progressive Web App** with offline support

## Credits

**Made by CDS** with passion for the neon generation.

Built with v0 • No external assets • Runs at 60 FPS

## License

MIT License - See LICENSE file for details.

Game assets and design are original creations.
