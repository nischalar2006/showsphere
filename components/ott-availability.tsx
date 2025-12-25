"use client"

import { Italic as Netflix, FileVideo as PrimeVideo, MoonStarIcon as HotstarIcon, AudioLinesIcon as JioCinemaIcon } from 'lucide-react'
import Image from "next/image"

interface OTTAvailabilityProps {
  platforms: string[]
}

const ottPlatforms = {
  Netflix: {
    icon: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=40&h=40&fit=crop",
    name: "Netflix",
    color: "from-red-600 to-red-700",
  },
  "Prime Video": {
    icon: "https://images.unsplash.com/photo-1566008319386-c14e56db60fc?w=40&h=40&fit=crop",
    name: "Prime Video",
    color: "from-blue-600 to-blue-700",
  },
  Hotstar: {
    icon: "https://images.unsplash.com/photo-1577086213219-553eb2c72b15?w=40&h=40&fit=crop",
    name: "Hotstar",
    color: "from-purple-600 to-purple-700",
  },
  JioCinema: {
    icon: "https://images.unsplash.com/photo-1557804506-669714d2e745?w=40&h=40&fit=crop",
    name: "JioCinema",
    color: "from-cyan-600 to-cyan-700",
  },
}

export function OTTAvailability({ platforms }: OTTAvailabilityProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Available On</h3>
      <div className="flex flex-wrap gap-3">
        {platforms.map((platform) => {
          const ottInfo = ottPlatforms[platform as keyof typeof ottPlatforms]
          if (!ottInfo) return null

          return (
            <button
              key={platform}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 active:scale-95 bg-gradient-to-r ${ottInfo.color} shadow-md hover:shadow-lg`}
            >
              <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                <span className="text-sm font-bold">{platform[0]}</span>
              </div>
              {platform}
            </button>
          )
        })}
      </div>
    </div>
  )
}
