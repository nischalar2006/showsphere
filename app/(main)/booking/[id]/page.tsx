"use client"

import { useState } from "react"
import { DateTimeSelector } from "@/components/date-time-selector"
import { CinemaSelector } from "@/components/cinema-selector"
import { SeatSelector } from "@/components/seat-selector"
import { BookingSummary } from "@/components/booking-summary"
import { ChevronRight, CheckCircle } from "lucide-react"
import { QRTicket } from "@/components/qr-ticket"

export default function BookingPage() {
  const [step, setStep] = useState<"date-time" | "cinema" | "seats" | "checkout" | "success">("date-time")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedCinema, setSelectedCinema] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const movieTitle = "Thamma"
  const movieRating = "UA16+"
  const totalPrice = selectedSeats.length * 620

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setStep("cinema")
  }

  const handleCinemaSelect = (cinema: any) => {
    setSelectedCinema(cinema)
    setStep("seats")
  }

  const handleSeatsSelect = (seats: string[]) => {
    setSelectedSeats(seats)
    setStep("checkout")
  }

  const handlePaymentSuccess = () => {
    setStep("success")
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Movie Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{movieTitle}</h1>
          <p className="text-primary-foreground/80">{movieRating}</p>
        </div>
      </div>

      {/* Stepper - Hide on success screen */}
      {step !== "success" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-4 mb-8 overflow-x-auto pb-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${step === "date-time" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <span className="font-bold">1. Date</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${step === "cinema" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <span className="font-bold">2. Cinema</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${step === "seats" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <span className="font-bold">3. Seats</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${step === "checkout" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <span className="font-bold">4. Checkout</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {step === "success" ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="bg-card rounded-2xl p-8 text-center shadow-lg border border-accent">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-12 h-12 text-accent fill-current" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">Your movie tickets have been successfully booked</p>

                <div className="space-y-3 bg-muted p-4 rounded-lg mb-6 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Movie:</span>
                    <span className="font-bold text-foreground">{movieTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cinema:</span>
                    <span className="font-bold text-foreground">{selectedCinema?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time:</span>
                    <span className="font-bold text-foreground">
                      {selectedDate?.toLocaleDateString()} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seats:</span>
                    <span className="font-bold text-foreground">{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 mt-3">
                    <span className="text-muted-foreground font-semibold">Total Paid:</span>
                    <span className="font-bold text-accent text-lg">₹{totalPrice}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  A confirmation email has been sent to your registered email address. Please arrive 15 minutes before
                  the show time.
                </p>

                <button
                  onClick={() => (window.location.href = "/movies")}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 rounded-lg transition-colors"
                >
                  Back to Movies
                </button>
              </div>

              <QRTicket
                movieTitle={movieTitle}
                theaterName={selectedCinema?.name || "Theater"}
                seats={selectedSeats}
                date={selectedDate}
                time={selectedTime}
                bookingId={`BS-${Date.now()}`}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === "date-time" && <DateTimeSelector onSelect={handleDateTimeSelect} />}
              {step === "cinema" && (
                <CinemaSelector onSelect={handleCinemaSelect} date={selectedDate} time={selectedTime} />
              )}
              {step === "seats" && <SeatSelector onSelect={handleSeatsSelect} cinema={selectedCinema} />}
              {step === "checkout" && (
                <CheckoutSummary
                  movie={movieTitle}
                  cinema={selectedCinema}
                  date={selectedDate}
                  time={selectedTime}
                  seats={selectedSeats}
                  totalPrice={totalPrice}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <BookingSummary
                movieTitle={movieTitle}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedCinema={selectedCinema}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CheckoutSummary({ movie, cinema, date, time, seats, totalPrice, onPaymentSuccess }: any) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCompletePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentSuccess()
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Confirm Your Booking</h2>

        <div className="space-y-4 mb-8 pb-8 border-b border-border">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {movie} - {time}
            </span>
            <span className="font-bold text-foreground">{date?.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{cinema?.name}</span>
            <span className="font-bold text-foreground">{cinema?.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seats: {seats.join(", ")}</span>
            <span className="font-bold text-foreground">₹{totalPrice}</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-foreground">Payment Method</h3>
          <div className="space-y-2">
            {[
              { id: "card", label: "Credit/Debit Card" },
              { id: "upi", label: "UPI" },
              { id: "wallet", label: "Digital Wallet" },
            ].map((method) => (
              <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-foreground">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleCompletePayment}
          disabled={isProcessing}
          className="w-full bg-accent hover:bg-accent/90 disabled:bg-muted disabled:text-muted-foreground text-accent-foreground font-bold py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : `Complete Payment • ₹${totalPrice}`}
        </button>
      </div>
    </div>
  )
}
