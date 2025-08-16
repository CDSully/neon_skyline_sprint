"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Volume2, Eye, Palette } from "lucide-react"
import Link from "next/link"

interface Settings {
  musicVol: number
  sfxVol: number
  muteAll: boolean
  theme: "dark" | "daylight"
  reduceMotion: boolean
  colorblind: "off" | "deut" | "prot" | "trit"
  oneHand: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    musicVol: 0.7,
    sfxVol: 0.8,
    muteAll: false,
    theme: "dark",
    reduceMotion: false,
    colorblind: "off",
    oneHand: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem("nss_v1_settings")
    if (stored) {
      setSettings({ ...settings, ...JSON.parse(stored) })
    }
  }, [])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("nss_v1_settings", JSON.stringify(newSettings))
  }

  const resetData = () => {
    if (confirm("This will delete all your progress, settings, and high scores. Are you sure?")) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("nss_v1_")) {
          localStorage.removeItem(key)
        }
      })
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Volume2 className="h-5 w-5" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span>Mute All</span>
                <Switch checked={settings.muteAll} onCheckedChange={(checked) => updateSetting("muteAll", checked)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Music Volume</span>
                  <span className="text-sm text-gray-400">{Math.round(settings.musicVol * 100)}%</span>
                </div>
                <Slider
                  value={[settings.musicVol]}
                  onValueChange={([value]) => updateSetting("musicVol", value)}
                  max={1}
                  step={0.1}
                  disabled={settings.muteAll}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>SFX Volume</span>
                  <span className="text-sm text-gray-400">{Math.round(settings.sfxVol * 100)}%</span>
                </div>
                <Slider
                  value={[settings.sfxVol]}
                  onValueChange={([value]) => updateSetting("sfxVol", value)}
                  max={1}
                  step={0.1}
                  disabled={settings.muteAll}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Settings */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <Eye className="h-5 w-5" />
                Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <span>Theme</span>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "dark" | "daylight") => updateSetting("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Neon Dark</SelectItem>
                    <SelectItem value="daylight">Daylight Pastel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>Reduce Motion</span>
                  <p className="text-sm text-gray-400">Disables parallax, particles, and scanlines</p>
                </div>
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => updateSetting("reduceMotion", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card className="bg-black/40 border-pink-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <Palette className="h-5 w-5" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <span>Colorblind Support</span>
                <Select value={settings.colorblind} onValueChange={(value: any) => updateSetting("colorblind", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="deut">Deuteranopia</SelectItem>
                    <SelectItem value="prot">Protanopia</SelectItem>
                    <SelectItem value="trit">Tritanopia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span>One-Hand Mode</span>
                  <p className="text-sm text-gray-400">Large touch controls at bottom</p>
                </div>
                <Switch checked={settings.oneHand} onCheckedChange={(checked) => updateSetting("oneHand", checked)} />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-300">Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  This game stores data locally on your device only. No data is sent to external servers.
                </p>
                <Button variant="destructive" onClick={resetData} className="w-full">
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
