"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCity } from "@/context/city-context"

const allEvents = [
  {
    id: 1,
    title: "Royal Enfield Motoverse 2025",
    image: "https://bull-leds.in/wp-content/uploads/2023/11/20231124015310__RE2520Shotgun2520Web2520Resized2520and2520Watermarked._005.jpeg",
    category: "Music Festival",
    price: "₹1,499",
    discount: "30% off",
    visitors: "8500+",
    date: "Nov 21-23, 2025",
    location: "Goa",
  },
  {
    id: 2,
    title: "ICW Official Afterparty",
    image: "https://curlytales.com/wp-content/uploads/2024/03/ICW-Goa.jpg",
    category: "Live Music",
    price: "₹499",
    discount: "25% off",
    visitors: "3200+",
    date: "Nov 8-10, 2025",
    location: "Gurugram",
  },
  {
    id: 3,
    title: "Jazz Night Live",
    image: "https://img.freepik.com/premium-vector/live-music-jazz-night-neon_77399-628.jpg",
    category: "Live Music",
    price: "₹799",
    discount: "20% off",
    visitors: "2100+",
    date: "Nov 15, 2025",
    location: "Mumbai",
  },
  {
    id: 4,
    title: "Comedy Show Series",
    image: "https://cdnb.artstation.com/p/marketplace/presentation_assets/002/852/247/20230711120141/thumbnail/file.jpg?1689094887",
    category: "Comedy",
    price: "₹599",
    discount: "15% off",
    visitors: "1800+",
    date: "Nov 22, 2025",
    location: "Delhi",
  },
]

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; event: (typeof allEvents)[0] | null }>({
    isOpen: false,
    event: null,
  })
  const { selectedCity } = useCity()

  const categories = ["All", "Music Festival", "Live Music", "Comedy"]

  const filteredEvents = useMemo(() => {
    let events = allEvents
    if (selectedCategory !== "All") {
      events = events.filter((event) => event.category === selectedCategory)
    }
    return events.filter((event) => event.location === selectedCity)
  }, [selectedCategory, selectedCity])

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Upcoming Events in {selectedCity}</h1>
          <p className="text-lg text-muted-foreground">Discover and book tickets for the best events in your city</p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition ${selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {event.discount}
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-accent font-bold mb-2">{event.category}</p>
                <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{event.visitors} visitors</span>
                  <span className="font-bold text-accent">{event.price}</span>
                </div>
                <Button
                  onClick={() => setBookingModal({ isOpen: true, event })}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No events found in {selectedCity}</p>
          </div>
        )}
      </main>

      {bookingModal.event && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, event: null })}
          title={bookingModal.event.title}
          price={bookingModal.event.price}
          type="event"
        />
      )}

      <Footer />
    </div>
  )
}
