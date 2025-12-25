"use client"

import { useState, useRef } from "react"
import { Download, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface QRTicketProps {
  movieTitle: string
  theaterName: string
  seats: string[]
  date: Date | null
  time: string
  bookingId: string
  totalPrice: number
}

export function QRTicket({ movieTitle, theaterName, seats, date, time, bookingId, totalPrice }: QRTicketProps) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  // Create a string with booking details to encode in QR code
  const qrData = JSON.stringify({
    bookingId,
    movieTitle,
    theaterName,
    seats: seats.join(", "),
    date: date?.toLocaleDateString(),
    time,
    totalPrice,
  })

  const downloadQR = () => {
    const element = qrRef.current?.querySelector("svg")
    if (element) {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const image = new Image()

      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        ctx?.drawImage(image, 0, 0)
        const url = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.download = `ticket-${bookingId}.png`
        link.href = url
        link.click()
      }

      image.src = "data:image/svg+xml;base64," + btoa(new XMLSerializer().serializeToString(element))
    }
  }

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card rounded-2xl p-8 border border-accent/20 max-w-md mx-auto shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Your Digital Ticket</h3>
        <p className="text-sm text-muted-foreground">Scan at the theater entrance</p>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-lg mb-6 flex justify-center" ref={qrRef}>
        <QRCodeSVG value={qrData} size={200} level="H" includeMargin={true} />
      </div>

      {/* Ticket Details */}
      <div className="space-y-4 bg-muted p-4 rounded-lg mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Movie</p>
          <p className="font-bold text-foreground text-lg">{movieTitle}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Theater</p>
          <p className="font-bold text-foreground">{theaterName}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-bold text-foreground text-sm">{date?.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-bold text-foreground text-sm">{time}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Seats</p>
          <p className="font-bold text-foreground text-lg">{seats.join(", ")}</p>
        </div>
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
          <div className="flex items-center justify-between bg-background p-3 rounded">
            <p className="font-mono font-bold text-foreground">{bookingId}</p>
            <button onClick={copyBookingId} className="text-accent hover:text-accent/80 transition-colors">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Print
        </button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Please arrive 15 minutes before show time. Keep this ticket safe.
      </p>
    </div>
  )
}
