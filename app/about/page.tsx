"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Zap, Shield, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            About
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Game Info */}
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Gamepad2 className="h-5 w-5" />
                Neon Skyline Sprint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                A polished, high-FPS endless runner in a neon 2.5D skyline. Dodge obstacles across three lanes, chain
                perfect dodges for multiplier bonuses, collect shards, and activate power-ups while a synthy soundtrack
                pulses.
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                  v1.0
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  WebGL
                </Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                  PWA Ready
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-cyan-300">Features:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 6+ obstacle types with procedural patterns</li>
                  <li>• 4 power-ups: Shield, Magnet, Slow-Time, Score Rush</li>
                  <li>• Daily runs with deterministic seeding</li>
                  <li>• Full accessibility support</li>
                  <li>• Mobile-optimized touch controls</li>
                  <li>• Performance auto-tuning (60 FPS target)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Zap className="h-5 w-5" />
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Desktop:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>
                    <kbd className="bg-gray-700 px-1 rounded">←/→</kbd> or{" "}
                    <kbd className="bg-gray-700 px-1 rounded">A/D</kbd> - Switch lanes
                  </li>
                  <li>
                    <kbd className="bg-gray-700 px-1 rounded">Space</kbd> or{" "}
                    <kbd className="bg-gray-700 px-1 rounded">W</kbd> - Jump
                  </li>
                  <li>
                    <kbd className="bg-gray-700 px-1 rounded">S</kbd> or{" "}
                    <kbd className="bg-gray-700 px-1 rounded">↓</kbd> - Slide
                  </li>
                  <li>
                    <kbd className="bg-gray-700 px-1 rounded">P</kbd> or{" "}
                    <kbd className="bg-gray-700 px-1 rounded">Esc</kbd> - Pause
                  </li>
                  <li>
                    <kbd className="bg-gray-700 px-1 rounded">`</kbd> - Performance overlay
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Mobile:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Left/right zones - Switch lanes</li>
                  <li>• Tap anywhere - Jump</li>
                  <li>• Swipe down - Slide</li>
                  <li>• Pause button (top-right)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Tech */}
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Shield className="h-5 w-5" />
                Privacy & Tech
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Privacy First:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• No data collection or analytics</li>
                  <li>• No external network requests</li>
                  <li>• All data stored locally only</li>
                  <li>• No cookies or tracking</li>
                  <li>• Works completely offline</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-300 mb-2">Tech Stack:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Next.js 15 + React 18</li>
                  <li>• TypeScript + Tailwind CSS</li>
                  <li>• Canvas2D + WebAudio API</li>
                  <li>• Progressive Web App</li>
                  <li>• Zero external dependencies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <Heart className="h-5 w-5" />
                Credits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-pink-300 mb-2">Made by CDS</h4>
                <p className="text-sm text-gray-300">
                  Built with passion for the neon generation. This game represents hundreds of hours of careful
                  optimization, accessibility work, and game design iteration.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-pink-300 mb-2">Special Thanks:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• The vaporwave aesthetic community</li>
                  <li>• Accessibility advocates and testers</li>
                  <li>• Open source contributors</li>
                  <li>• Players who provided feedback</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-pink-500/20">
                <p className="text-xs text-gray-400">
                  Licensed under MIT. Source code available for educational purposes. Game assets and design are
                  original creations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Version 1.0 • Built with v0 • No external assets • Runs at 60 FPS</p>
        </div>
      </div>
    </div>
  )
}
