"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { GameEngine } from "@/lib/engine/game-engine"
import { HUD } from "@/components/HUD"
import { PauseMenu } from "@/components/PauseMenu"
import { GameOverModal } from "@/components/GameOverModal"
import { TutorialModal } from "@/components/TutorialModal"
import { MobileControls } from "@/components/MobileControls"
import { PerfOverlay } from "@/components/PerfOverlay"

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const searchParams = useSearchParams()
  const isDailyMode = searchParams?.get("mode") === "daily"

  const [gameState, setGameState] = useState({
    scene: "LOADING" as const,
    score: 0,
    multiplier: 1,
    shards: 0,
    lives: 1,
    powerUps: {
      shield: { active: false, timeLeft: 0 },
      magnet: { active: false, timeLeft: 0 },
      slowTime: { active: false, timeLeft: 0 },
      scoreRush: { active: false, timeLeft: 0 },
    },
  })

  const [showTutorial, setShowTutorial] = useState(false)
  const [showPerfOverlay, setShowPerfOverlay] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("dev=1")) {
      setShowPerfOverlay(true)
    }
  }, [])

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const engine = new GameEngine(canvas, isDailyMode)
    engineRef.current = engine

    // Set up game state updates
    engine.onStateUpdate = (state) => {
      setGameState(state)
    }

    // Check if tutorial should be shown
    const tutorialSeen = localStorage.getItem("nss_v1_tutorialSeen")
    if (!tutorialSeen) {
      setShowTutorial(true)
    } else {
      engine.start()
    }

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
        case "KeyA":
          engine.input("LANE_LEFT")
          e.preventDefault()
          break
        case "ArrowRight":
        case "KeyD":
          engine.input("LANE_RIGHT")
          e.preventDefault()
          break
        case "Space":
        case "KeyW":
        case "ArrowUp":
          engine.input("JUMP")
          e.preventDefault()
          break
        case "KeyS":
        case "ArrowDown":
          engine.input("SLIDE")
          e.preventDefault()
          break
        case "KeyP":
          engine.input("PAUSE")
          e.preventDefault()
          break
        case "Escape":
          if (gameState.scene === "PLAY") {
            engine.input("PAUSE")
          }
          e.preventDefault()
          break
        case "Backquote":
          setShowPerfOverlay(!showPerfOverlay)
          e.preventDefault()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      engine.destroy()
    }
  }, [isDailyMode])

  const handleTutorialClose = useCallback(() => {
    setShowTutorial(false)
    localStorage.setItem("nss_v1_tutorialSeen", "true")
    engineRef.current?.start()
  }, [])

  const handleMobileInput = useCallback((action: string) => {
    engineRef.current?.input(action)
  }, [])

  const handleRestart = useCallback(() => {
    engineRef.current?.restart()
  }, [])

  const handleResume = useCallback(() => {
    engineRef.current?.resume()
  }, [])

  const handleExit = useCallback(() => {
    window.location.href = "/"
  }, [])

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Game canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ touchAction: "none" }} />

      {/* Watermark */}
      <div className="absolute bottom-4 left-4 text-white/30 text-xs md:text-sm font-mono pointer-events-none select-none">
        Made by CDS
      </div>

      {/* HUD */}
      {gameState.scene === "PLAY" && (
        <HUD
          score={gameState.score}
          multiplier={gameState.multiplier}
          shards={gameState.shards}
          lives={gameState.lives}
          powerUps={gameState.powerUps}
          onPause={() => engineRef.current?.input("PAUSE")}
        />
      )}

      {/* Mobile controls */}
      <MobileControls onInput={handleMobileInput} visible={gameState.scene === "PLAY"} />

      {/* Modals */}
      {showTutorial && <TutorialModal onClose={handleTutorialClose} />}

      {gameState.scene === "PAUSE" && (
        <PauseMenu onResume={handleResume} onRestart={handleRestart} onExit={handleExit} />
      )}

      {gameState.scene === "GAME_OVER" && (
        <GameOverModal
          score={gameState.score}
          multiplier={gameState.multiplier}
          shards={gameState.shards}
          onRestart={handleRestart}
          onExit={handleExit}
          isDailyMode={isDailyMode}
        />
      )}

      {showPerfOverlay && <PerfOverlay gameEngine={engineRef.current} />}
    </div>
  )
}
