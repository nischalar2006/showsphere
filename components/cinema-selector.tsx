"use client"

import { useState } from "react"
import { MapPin, Clock, Zap } from "lucide-react"

const cinemas = [
  {
    id: 1,
    name: "INOX Garudha Mall",
    location: "Magrath rd, Ashok Nagar",
    distance: "6.4 km away",
    cancellation: "Allows cancellation",
    formats: ["LASER", "4DX-2D"],
    showtimes: [
      { time: "10:40 AM", format: "LASER" },
      { time: "01:15 PM", format: "4DX-2D" },
      { time: "04:30 PM", format: "LASER" },
    ],
  },
  {
    id: 2,
    name: "Cinepolis Binnypet",
    location: "Tank Bund rd, Binny Pete,Jagajeevanram",
    distance: "2.6 km away",
    cancellation: "Allows cancellation",
    formats: ["IMAX", "Standard"],
    showtimes: [
      { time: "11:00 AM", format: "Standard" },
      { time: "02:00 PM", format: "IMAX" },
      { time: "05:15 PM", format: "Standard" },
    ],
  },
  {
    id: 3,
    name: "Lulu Mall",
    location: "Gopalapura, Rajajinagar",
    distance: "2.0 km away",
    cancellation: "Allows cancellation",
    formats: ["Dolby", "Premium"],
    showtimes: [
      { time: "10:30 AM", format: "Premium" },
      { time: "01:30 PM", format: "Dolby" },
      { time: "04:45 PM", format: "Premium" },
    ],
  },
]

export function CinemaSelector({
  onSelect,
  date,
  time,
}: { onSelect: (cinema: any) => void; date?: Date; time?: string }) {
  const [selectedCinema, setSelectedCinema] = useState<any>(null)

  const handleSelect = (cinema: any) => {
    setSelectedCinema(cinema)
    onSelect(cinema)
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Select Cinema</h2>

      <div className="space-y-4">
        {cinemas.map((cinema) => (
          <div
            key={cinema.id}
            onClick={() => handleSelect(cinema)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition ${
              selectedCinema?.id === cinema.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{cinema.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  {cinema.location}
                </div>
              </div>
              {selectedCinema?.id === cinema.id && (
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-accent-foreground text-lg">✓</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {cinema.distance}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Zap className="w-4 h-4" />
                {cinema.cancellation}
              </div>
            </div>

            {/* Showtimes */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase">Available Shows</p>
              <div className="grid grid-cols-3 gap-2">
                {cinema.showtimes.map((show, idx) => (
                  <div
                    key={idx}
                    className="bg-muted p-2 rounded-lg text-center hover:bg-muted/80 transition cursor-pointer"
                  >
                    <p className="text-sm font-bold text-foreground">{show.time}</p>
                    <p className="text-xs text-muted-foreground">{show.format}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
