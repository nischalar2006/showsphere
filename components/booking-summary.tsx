import { MapPin, Calendar, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function BookingSummary({
  movieTitle,
  selectedDate,
  selectedTime,
  selectedCinema,
  selectedSeats,
  totalPrice,
}: any) {
  const basePrice = 620 // Example base price
  const gst = Math.round(totalPrice * 0.18)
  const convenienceFee = 50
  const finalTotal = totalPrice + gst + convenienceFee

  return (
    <div className="sticky top-24 bg-card rounded-xl p-6 border border-border shadow-lg">
      <h3 className="font-bold text-lg mb-6 text-foreground">Booking Summary</h3>

      <div className="space-y-4 mb-6">
        {/* Movie */}
        {movieTitle && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-bold">Movie</p>
            <p className="font-bold text-foreground">{movieTitle}</p>
          </div>
        )}

        {/* Date & Time */}
        {selectedDate && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Date & Time
            </p>
            <p className="font-bold text-foreground">
              {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
            {selectedTime && <p className="text-sm text-muted-foreground">{selectedTime}</p>}
          </div>
        )}

        {/* Cinema */}
        {selectedCinema && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Cinema
            </p>
            <p className="font-bold text-foreground text-sm">{selectedCinema.name}</p>
          </div>
        )}

        {/* Seats */}
        {selectedSeats.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2">
              <Users className="w-3 h-3" /> Seats
            </p>
            <p className="font-bold text-foreground text-sm">{selectedSeats.join(", ")}</p>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      {totalPrice > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ticket Price</span>
              <span className="text-foreground">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="text-foreground">₹{gst}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Convenience Fee</span>
              <span className="text-foreground">₹{convenienceFee}</span>
            </div>
          </div>

          <Separator className="my-4" />
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-accent">₹{finalTotal}</span>
          </div>

          <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 rounded-lg transition-colors">
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  )
}
