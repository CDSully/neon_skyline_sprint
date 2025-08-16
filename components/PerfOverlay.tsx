"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function PerfOverlay() {
  const [stats, setStats] = useState({
    fps: 0,
    updateMs: 0,
    drawMs: 0,
    objectsDrawn: 0,
    particleCount: 0,
    devicePixelRatio: 1,
    effectTier: "HIGH",
    droppedFrames: 0,
  })

  useEffect(() => {
    // This would be connected to the actual game engine
    // For now, showing placeholder values
    const interval = setInterval(() => {
      setStats({
        fps: Math.floor(Math.random() * 10) + 55,
        updateMs: Math.random() * 3 + 1,
        drawMs: Math.random() * 4 + 2,
        objectsDrawn: Math.floor(Math.random() * 50) + 20,
        particleCount: Math.floor(Math.random() * 100) + 50,
        devicePixelRatio: window.devicePixelRatio || 1,
        effectTier: "HIGH",
        droppedFrames: Math.floor(Math.random() * 3),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="absolute top-4 right-4 bg-black/80 border-yellow-500/30 backdrop-blur-sm text-xs font-mono">
      <CardContent className="p-3 space-y-1">
        <div className="text-yellow-300 font-bold">Performance</div>
        <div>
          FPS: <span className="text-green-300">{stats.fps}</span>
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
          DPR: <span className="text-orange-300">{stats.devicePixelRatio.toFixed(1)}</span>
        </div>
        <div>
          Tier: <span className="text-green-300">{stats.effectTier}</span>
        </div>
        <div>
          Dropped: <span className="text-red-300">{stats.droppedFrames}</span>
        </div>
      </CardContent>
    </Card>
  )
}
