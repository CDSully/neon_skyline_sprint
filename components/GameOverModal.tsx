"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Home, Share, Camera, Trophy } from "lucide-react"

interface GameOverModalProps {
  score: number
  multiplier: number
  shards: number
  onRestart: () => void
  onExit: () => void
  isDailyMode: boolean
}

export function GameOverModal({ score, multiplier, shards, onRestart, onExit, isDailyMode }: GameOverModalProps) {
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [previousBest, setPreviousBest] = useState(0)

  useEffect(() => {
    const key = isDailyMode ? "daily" : "normal"
    const highscores = JSON.parse(localStorage.getItem("nss_v1_highscores") || "{}")
    const currentBest = highscores[key]?.score || 0

    setPreviousBest(currentBest)

    if (score > currentBest) {
      setIsNewRecord(true)
      highscores[key] = { score, date: new Date().toISOString() }
      localStorage.setItem("nss_v1_highscores", JSON.stringify(highscores))
    }

    // Save run to history
    const lastRuns = JSON.parse(localStorage.getItem("nss_v1_lastRuns") || "[]")
    lastRuns.unshift({
      score,
      duration: Date.now(), // Placeholder - would be actual duration
      maxCombo: 0, // Placeholder
      maxMultiplier: multiplier,
      date: new Date().toISOString(),
    })

    // Keep only last 5 runs
    if (lastRuns.length > 5) {
      lastRuns.splice(5)
    }

    localStorage.setItem("nss_v1_lastRuns", JSON.stringify(lastRuns))
  }, [score, multiplier, isDailyMode])

  const handleShare = async () => {
    const text = `I just scored ${score.toLocaleString()} points in Neon Skyline Sprint! ${isDailyMode ? "(Daily Run)" : ""}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Neon Skyline Sprint",
          text,
          url: window.location.origin,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${text} ${window.location.origin}`)
        // Could show a toast here
      } catch (err) {
        console.error("Failed to copy to clipboard")
      }
    }
  }

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-black/90 border-red-500/30 backdrop-blur-sm w-96">
        <CardHeader>
          <CardTitle className="text-center text-red-300 flex items-center justify-center gap-2">
            {isNewRecord && <Trophy className="h-5 w-5 text-yellow-400" />}
            Game Over
            {isNewRecord && <Trophy className="h-5 w-5 text-yellow-400" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-white font-mono">{score.toLocaleString()}</div>
            {isNewRecord ? (
              <Badge className="bg-yellow-500/80 text-white">New {isDailyMode ? "Daily" : "Personal"} Best!</Badge>
            ) : (
              <div className="text-sm text-gray-400">Best: {previousBest.toLocaleString()}</div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-cyan-300">{multiplier}x</div>
              <div className="text-xs text-gray-400">Max Multiplier</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-300">{shards}</div>
              <div className="text-xs text-gray-400">Shards Collected</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-green-500/50 text-green-300 hover:bg-green-500/10 bg-transparent"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>

              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10 bg-transparent"
              >
                <Camera className="mr-2 h-4 w-4" />
                Photo
              </Button>
            </div>

            <Button
              onClick={onExit}
              variant="outline"
              className="w-full border-gray-500/50 text-gray-300 hover:bg-gray-500/10 bg-transparent"
            >
              <Home className="mr-2 h-4 w-4" />
              Exit to Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
