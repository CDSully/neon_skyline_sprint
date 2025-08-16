"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface PerfOverlayProps {
  gameEngine?: any
}

export function PerfOverlay({ gameEngine }: PerfOverlayProps) {
  const [stats, setStats] = useState({
    fps: 0,
    updateMs: 0,
    drawMs: 0,
    objectsDrawn: 0,
    particleCount: 0,
    devicePixelRatio: 1,
    effectiveDpr: 1,
    performanceTier: "HIGH",
    droppedFrames: 0,
  })

  useEffect(() => {
    if (!gameEngine) return

    const interval = setInterval(() => {
      const perfStats = gameEngine.getPerformanceStats()
      setStats(perfStats)
    }, 100) // Update 10 times per second

    return () => clearInterval(interval)
  }, [gameEngine])

  const showDevHint = typeof window !== "undefined" && window.location.search.includes("dev=1")

  return (
    <Card className="absolute top-4 right-4 bg-black/80 border-yellow-500/30 backdrop-blur-sm text-xs font-mono">
      <CardContent className="p-3 space-y-1">
        <div className="text-yellow-300 font-bold">Performance Debug</div>
        <div>
          FPS:{" "}
          <span
            className={`${stats.fps >= 55 ? "text-green-300" : stats.fps >= 45 ? "text-yellow-300" : "text-red-300"}`}
          >
            {stats.fps}
          </span>
        </div>
        <div>
          Update: <span className="text-cyan-300">{stats.updateMs.toFixed(1)}ms</span>
        </div>
        <div>
          Draw: <span className="text-purple-300">{stats.drawMs.toFixed(1)}ms</span>
        </div>
        <div>
          Objects: <span className="text-blue-300">{stats.objectsDrawn}</span>
        </div>
        <div>
          Particles: <span className="text-pink-300">{stats.particleCount}</span>
        </div>
        <div>
          DPR: <span className="text-orange-300">{stats.effectiveDpr.toFixed(1)}</span>
          <span className="text-gray-400">/{stats.devicePixelRatio.toFixed(1)}</span>
        </div>
        <div>
          Tier:{" "}
          <span
            className={`${stats.performanceTier === "HIGH" ? "text-green-300" : stats.performanceTier === "MEDIUM" ? "text-yellow-300" : "text-red-300"}`}
          >
            {stats.performanceTier}
          </span>
        </div>
        <div>
          Dropped: <span className="text-red-300">{stats.droppedFrames}</span>
        </div>
        {showDevHint && (
          <div className="text-gray-400 text-[10px] mt-2 border-t border-gray-600 pt-1">Press ` to toggle</div>
        )}
      </CardContent>
    </Card>
  )
}
