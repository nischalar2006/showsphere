"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const seatCategories = [
  {
    name: "Royal Recliner",
    price: 620,
    rows: ["A", "B"],
    seatsPerRow: 10,
    isVip: true,
  },
  {
    name: "Royal",
    price: 400,
    rows: ["C", "D", "E"],
    seatsPerRow: 13,
    isVip: false,
  },
  {
    name: "Club",
    price: 380,
    rows: ["F", "G"],
    seatsPerRow: 14,
    isVip: false,
  },
]

export function SeatSelector({ onSelect, cinema }: { onSelect: (seats: string[]) => void; cinema?: any }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const handleSeatToggle = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const handleConfirm = () => {
    if (selectedSeats.length > 0) {
      onSelect(selectedSeats)
    }
  }

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    for (const category of seatCategories) {
      if (category.rows.some((row) => seatId.startsWith(row))) {
        return sum + category.price
      }
    }
    return sum
  }, 0)

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Select Your Seats</h2>
      <p className="text-muted-foreground mb-8">Cinema: {cinema?.name}</p>

      {/* Seat Legend */}
      <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
        {seatCategories.map((category) => (
          <div key={category.name} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${category.isVip ? 'bg-[#FACC15]' : 'bg-[#374151]'}`}></div>
            <span className="text-sm text-foreground">
              {category.name} • ₹{category.price}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#9CA3AF]"></div>
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#2563EB]"></div>
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
      </div>

      {/* Seats Layout */}
      <div className="flex flex-col items-center space-y-6">
        {seatCategories.map((category) => (
          <div key={category.name} className="w-full">
            {category.rows.map((row) => (
              <div key={row} className="flex items-center gap-4 mb-3">
                <span className="font-bold text-foreground w-8">{row}</span>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: category.seatsPerRow }).map((_, idx) => {
                    const seatId = `${row}${idx + 1}`
                    const isSelected = selectedSeats.includes(seatId)
                    const isBooked = Math.random() > 0.8 // Simulate 20% booked seats

                    // Determine seat style
                    let seatStyle = "bg-[#374151] text-gray-200 hover:bg-[#4B5563] border border-transparent" // Default Available

                    if (isBooked) {
                      seatStyle = "bg-[#9CA3AF] cursor-not-allowed text-gray-600"
                    } else if (isSelected) {
                      seatStyle = "bg-[#2563EB] text-white shadow-md scale-105"
                    } else if (category.isVip) {
                      seatStyle = "bg-[#FACC15] text-black hover:bg-[#FDE047] border border-transparent"
                    }

                    return (
                      <button
                        key={seatId}
                        onClick={() => !isBooked && handleSeatToggle(seatId)}
                        disabled={isBooked}
                        className={`w-8 h-8 rounded-md font-bold text-xs transition-all duration-200 ${seatStyle}`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Selected Seats:</p>
            <p className="text-lg font-bold text-foreground">{selectedSeats.join(", ") || "No seats selected"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Price:</p>
            <p className="text-2xl font-bold text-accent">₹{totalPrice}</p>
          </div>
        </div>
        <Button
          onClick={handleConfirm}
          disabled={selectedSeats.length === 0}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed font-bold h-12 text-lg rounded-lg"
        >
          Continue to Checkout
        </Button>
      </div>
    </div>
  )
}
