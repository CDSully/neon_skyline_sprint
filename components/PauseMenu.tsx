"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, RotateCcw, Home, Settings } from "lucide-react"
import Link from "next/link"

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onExit: () => void
}

export function PauseMenu({ onResume, onRestart, onExit }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-black/90 border-cyan-500/30 backdrop-blur-sm w-80">
        <CardHeader>
          <CardTitle className="text-center text-cyan-300">Game Paused</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Play className="mr-2 h-4 w-4" />
            Resume
          </Button>

          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </Button>

          <Link href="/settings">
            <Button
              variant="outline"
              className="w-full border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 bg-transparent"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>

          <Button
            onClick={onExit}
            variant="outline"
            className="w-full border-gray-500/50 text-gray-300 hover:bg-gray-500/10 bg-transparent"
          >
            <Home className="mr-2 h-4 w-4" />
            Exit to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
