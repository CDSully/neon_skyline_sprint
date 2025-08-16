"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react"

interface TutorialModalProps {
  onClose: () => void
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-black/90 border-cyan-500/30 backdrop-blur-sm max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-300">How to Play</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <ArrowLeft className="h-5 w-5 text-cyan-300" />
                <ArrowRight className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="text-sm">Switch lanes (or tap left/right zones)</span>
            </div>

            <div className="flex items-center gap-3">
              <ArrowUp className="h-5 w-5 text-purple-300" />
              <span className="text-sm">Jump over obstacles (or tap screen)</span>
            </div>

            <div className="flex items-center gap-3">
              <ArrowDown className="h-5 w-5 text-pink-300" />
              <span className="text-sm">Slide under beams (or swipe down)</span>
            </div>
          </div>

          {/* Gameplay tips */}
          <div className="space-y-2">
            <h4 className="font-semibold text-cyan-300">Tips:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Collect blue shards for points</li>
              <li>• Avoid red obstacles</li>
              <li>• Power-ups: Shield, Magnet, Slow, Rush</li>
              <li>• Perfect dodges build your multiplier</li>
              <li>• Score = distance + shards + multipliers</li>
            </ul>
          </div>

          {/* Start button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            Start Playing!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
