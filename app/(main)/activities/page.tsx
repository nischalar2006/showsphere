"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookingModal } from "@/components/booking-modal"
import { Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCity } from "@/context/city-context"

const allActivities = [
  {
    id: 1,
    title: "E-O-D Adventure Park",
    image: "https://delhisnap.com/wp-content/uploads/2023/03/E-O-D-Adventure-Park-DelhiSnap-1024x576.jpg",
    category: "Adventure",
    price: "₹399",
    discount: "20% off",
    visitors: "5000+",
    rating: 4.5,
    frequency: "Daily, 9:00 AM onwards",
    location: "Delhi",
  },
  {
    id: 2,
    title: "Turbo Track Go Karting",
    image: "https://tse3.mm.bing.net/th/id/OIP.U60Fk6imPjRhHS2vMxndSwHaE6?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Sports",
    price: "₹699",
    discount: "20% off",
    visitors: "3200+",
    rating: 4.7,
    frequency: "Daily, Multiple slots",
    location: "Goa",
  },
  {
    id: 3,
    title: "Museum of Illusions",
    image: "https://moijoburg.co.za/wp-content/uploads/2024/07/image-press-release-post-joburg-SA-museum-of-illusions-opens-in-johannesburg-2080x1170-1.jpg",
    category: "Arts",
    price: "₹649",
    discount: "20% off",
    visitors: "4100+",
    rating: 4.6,
    frequency: "Daily, Multiple slots",
    location: "Mumbai",
  },
  {
    id: 4,
    title: "Boulderbox Climbing",
    image: "https://assets-global.website-files.com/5af93e3da9b84e47adb89ae6/5d0f15d463d73b0a429d17d1_BB-ClimbingDramatic1_PC-NishantShukla.jpg",
    category: "Adventure",
    price: "₹800",
    discount: "20% off",
    visitors: "2800+",
    rating: 4.8,
    frequency: "Daily, 9:00 AM onwards",
    location: "Bangalore",
  },
  {
    id: 5,
    title: "Zen Golf Range & Academy",
    image: "https://zen.golf/wp-content/uploads/2023/11/zenswingstage_01_72dpi_web.jpg",
    category: "Sports",
    price: "₹500",
    discount: "15% off",
    visitors: "2100+",
    rating: 4.4,
    frequency: "Daily, 6:00 AM onwards",
    location: "Hyderabad",
  },
  {
    id: 6,
    title: "Paintball Arena",
    image: "https://tse4.mm.bing.net/th/id/OIP.LLy0_MH9IGCi1IyTtzwZOQHaFH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Adventure",
    price: "₹599",
    discount: "25% off",
    visitors: "3500+",
    rating: 4.6,
    frequency: "Daily, Multiple slots",
    location: "Chennai",
  },
]

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; activity: (typeof allActivities)[0] | null }>({
    isOpen: false,
    activity: null,
  })
  const { selectedCity } = useCity()

  const categories = ["All", "Adventure", "Sports", "Arts"]

  const filteredActivities = useMemo(() => {
    let activities = allActivities
    if (selectedCategory !== "All") {
      activities = activities.filter((activity) => activity.category === selectedCategory)
    }
    return activities.filter((activity) => activity.location === selectedCity)
  }, [selectedCategory, selectedCity])

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Popular Activities in {selectedCity}</h1>
          <p className="text-lg text-muted-foreground">Explore amazing activities and experiences in your area</p>
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

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {activity.discount}
                </div>
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ {activity.rating}
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-accent font-bold mb-2">{activity.category}</p>
                <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{activity.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{activity.frequency}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{activity.visitors} visitors</span>
                  <span className="font-bold text-accent">{activity.price}</span>
                </div>
                <Button
                  onClick={() => setBookingModal({ isOpen: true, activity })}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No activities found in {selectedCity}</p>
          </div>
        )}
      </main>

      {bookingModal.activity && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={() => setBookingModal({ isOpen: false, activity: null })}
          title={bookingModal.activity.title}
          price={bookingModal.activity.price}
          type="activity"
        />
      )}

      <Footer />
    </div>
  )
}
