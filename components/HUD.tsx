"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pause, Shield, Magnet, Clock, Zap } from "lucide-react"

interface PowerUp {
  active: boolean
  timeLeft: number
}

interface HUDProps {
  score: number
  multiplier: number
  shards: number
  lives: number
  powerUps: {
    shield: PowerUp
    magnet: PowerUp
    slowTime: PowerUp
    scoreRush: PowerUp
  }
  onPause: () => void
}

export function HUD({ score, multiplier, shards, lives, powerUps, onPause }: HUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Score and stats */}
        <div className="space-y-2">
          <div className="text-2xl md:text-3xl font-bold text-white font-mono">{score.toLocaleString()}</div>
          <div className="flex gap-3 text-sm">
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
              x{multiplier}
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {shards} shards
            </Badge>
          </div>
        </div>

        {/* Pause button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPause}
          className="pointer-events-auto text-white hover:bg-white/10"
        >
          <Pause className="h-4 w-4" />
        </Button>
      </div>

      {/* Power-ups */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {powerUps.shield.active && (
            <Badge className="bg-blue-500/80 text-white flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {Math.ceil(powerUps.shield.timeLeft)}s
            </Badge>
          )}
          {powerUps.magnet.active && (
            <Badge className="bg-yellow-500/80 text-white flex items-center gap-1">
              <Magnet className="h-3 w-3" />
              {Math.ceil(powerUps.magnet.timeLeft)}s
            </Badge>
          )}
          {powerUps.slowTime.active && (
            <Badge className="bg-green-500/80 text-white flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.ceil(powerUps.slowTime.timeLeft)}s
            </Badge>
          )}
          {powerUps.scoreRush.active && (
            <Badge className="bg-red-500/80 text-white flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {Math.ceil(powerUps.scoreRush.timeLeft)}s
            </Badge>
          )}
        </div>
      </div>

      {/* Lives indicator */}
      {lives > 0 && (
        <div className="absolute bottom-4 right-4">
          <div className="flex gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-red-500 rounded-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
