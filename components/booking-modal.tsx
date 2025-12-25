"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import { LoginModal } from "./login-modal"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  price: string
  type: "event" | "activity"
}

export function BookingModal({ isOpen, onClose, title, price, type }: BookingModalProps) {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [bookedSeats, setBookedSeats] = useState<number[]>([1, 3, 8, 12, 15])

  if (!isOpen) return null

  const handleSeatClick = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber))
    } else {
      setSelectedSeats([...selectedSeats, seatNumber])
    }
  }

  const handleBooking = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    alert(`Booking confirmed for ${title}!\nSeats: ${selectedSeats.join(", ")}\nTotal: ₹${parseInt(price.replace(/[^0-9]/g, "")) * selectedSeats.length}`)
    setSelectedSeats([])
    onClose()
  }

  const totalPrice = parseInt(price.replace(/[^0-9]/g, "")) * selectedSeats.length

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">Price per {type}: {price}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {type === "event" && (
              <div className="mb-8">
                <h3 className="font-bold text-foreground mb-4">Select Seats</h3>
                <div className="bg-muted p-4 rounded-lg mb-6 text-center text-sm text-muted-foreground">
                  Screen
                </div>

                {/* Seat Selection Grid */}
                <div className="grid grid-cols-6 gap-2 max-w-sm">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const seatNumber = i + 1
                    const isBooked = bookedSeats.includes(seatNumber)
                    const isSelected = selectedSeats.includes(seatNumber)

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatClick(seatNumber)}
                        disabled={isBooked}
                        className={`w-10 h-10 rounded-lg font-semibold text-sm transition ${
                          isBooked
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : isSelected
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary/20 text-primary hover:bg-primary/40"
                        }`}
                      >
                        {seatNumber}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded"></div>
                    <span className="text-muted-foreground">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-accent rounded"></div>
                    <span className="text-muted-foreground">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted rounded"></div>
                    <span className="text-muted-foreground">Booked</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
                  <p className="font-bold text-foreground">Total: ₹{totalPrice}</p>
                </div>
              </div>
            )}

            {type === "activity" && (
              <div className="mb-8">
                <h3 className="font-bold text-foreground mb-4">Select Number of Tickets</h3>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedSeats(Math.max(0, (selectedSeats[0] || 0) - 1) > 0 ? [Math.max(0, (selectedSeats[0] || 0) - 1)] : [])}
                    className="w-12 h-12 rounded-lg bg-muted hover:bg-muted/80 font-bold text-lg transition"
                  >
                    −
                  </button>
                  <div className="flex-1 p-4 bg-muted rounded-lg text-center">
                    <p className="text-3xl font-bold text-foreground">{selectedSeats.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Tickets</p>
                  </div>
                  <button
                    onClick={() => setSelectedSeats([(selectedSeats[0] || 0) + 1])}
                    className="w-12 h-12 rounded-lg bg-muted hover:bg-muted/80 font-bold text-lg transition"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-foreground mb-4">Total: ₹{totalPrice}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-border bg-muted/50 sticky bottom-0">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={(type === "event" && selectedSeats.length === 0) || (type === "activity" && selectedSeats.length === 0)}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            >
              {user ? `Confirm Booking - ₹${totalPrice}` : "Login to Book"}
            </Button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
