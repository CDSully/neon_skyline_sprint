"use client"

import { useEffect, useRef } from "react"

interface MobileControlsProps {
  onInput: (action: string) => void
  visible: boolean
}

export function MobileControls({ onInput, visible }: MobileControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !visible) return

    const container = containerRef.current
    let touchStartY = 0
    let touchStartTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      touchStartY = touch.clientY
      touchStartTime = Date.now()

      const rect = container.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const width = rect.width

      // Lane switching zones (left 40%, right 40%)
      if (x < width * 0.4) {
        onInput("LANE_LEFT")
      } else if (x > width * 0.6) {
        onInput("LANE_RIGHT")
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.changedTouches[0]
      const touchEndY = touch.clientY
      const touchDuration = Date.now() - touchStartTime
      const swipeDistance = touchStartY - touchEndY

      // Swipe down for slide
      if (swipeDistance < -48 && touchDuration < 220) {
        onInput("SLIDE")
      } else if (touchDuration < 200) {
        // Quick tap for jump
        onInput("JUMP")
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [onInput, visible])

  if (!visible) return null

  return (
    <div ref={containerRef} className="absolute inset-0 z-10" style={{ touchAction: "none" }}>
      {/* Visual zones for debugging (remove in production) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 w-2/5 h-full bg-cyan-500/5 border-r border-cyan-500/20" />
        <div className="absolute right-0 top-0 w-2/5 h-full bg-purple-500/5 border-l border-purple-500/20" />
      </div>
    </div>
  )
}
