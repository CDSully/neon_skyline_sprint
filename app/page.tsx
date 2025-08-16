"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Settings, Info, Calendar, Moon, Sun, Accessibility } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("nss_v1_settings")
    if (stored) {
      const settings = JSON.parse(stored)
      setReduceMotion(settings.reduceMotion || false)
    }
  }, [])

  const toggleReduceMotion = () => {
    const newValue = !reduceMotion
    setReduceMotion(newValue)
    const stored = localStorage.getItem("nss_v1_settings")
    const settings = stored ? JSON.parse(stored) : {}
    settings.reduceMotion = newValue
    localStorage.setItem("nss_v1_settings", JSON.stringify(settings))
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className={`absolute inset-0 ${reduceMotion ? "" : "animate-pulse"}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        {!reduceMotion && (
          <>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-bounce" />
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-pink-400/20 rounded-full blur-xl animate-bounce" />
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-white hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleReduceMotion} className="text-white hover:bg-white/10">
            <Accessibility className="h-4 w-4" />
          </Button>
        </div>

        {/* Logo and title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            NEON
          </h1>
          <h2 className="text-3xl md:text-4xl font-light mb-2 text-cyan-300">SKYLINE SPRINT</h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            Dodge obstacles across three lanes in this high-FPS endless runner through a neon 2.5D skyline
          </p>
        </div>

        {/* Main menu */}
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid gap-4 w-80">
              <Link href="/play">
                <Button className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0">
                  <Play className="mr-2 h-5 w-5" />
                  Play
                </Button>
              </Link>

              <Link href="/play?mode=daily">
                <Button
                  variant="outline"
                  className="w-full h-12 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Daily Run
                  <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300">
                    {new Date().toLocaleDateString()}
                  </Badge>
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 bg-transparent"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>

                <Link href="/about">
                  <Button
                    variant="outline"
                    className="w-full border-pink-500/50 text-pink-300 hover:bg-pink-500/10 bg-transparent"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Made with ❤️ for the neon generation</p>
          <p className="mt-1">No data collected • Runs offline • Open source</p>
        </div>
      </div>
    </div>
  )
}
