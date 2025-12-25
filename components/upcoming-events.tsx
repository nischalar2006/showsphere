"use client"

import Image from "next/image"
import { ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const events = [
  {
    id: 1,
    title: "E-O-D Adventure Park",
    image: "https://delhisnap.com/wp-content/uploads/2023/03/E-O-D-Adventure-Park-DelhiSnap-1024x576.jpg",
    category: "Adventure",
    price: "₹399",
    discount: "20% off",
    visitors: "5000+",
  },
  {
    id: 2,
    title: "Turbo Track Go Karting",
    image: "https://tse3.mm.bing.net/th/id/OIP.U60Fk6imPjRhHS2vMxndSwHaE6?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Sports",
    price: "₹699",
    discount: "20% off",
    visitors: "3200+",
  },
  {
    id: 3,
    title: "Museum of Illusions",
    image: "https://moijoburg.co.za/wp-content/uploads/2024/07/image-press-release-post-joburg-SA-museum-of-illusions-opens-in-johannesburg-2080x1170-1.jpg",
    category: "Arts",
    price: "₹649",
    discount: "20% off",
    visitors: "4100+",
  },
  {
    id: 4,
    title: "Boulderbox Climbing",
    image: "https://assets-global.website-files.com/5af93e3da9b84e47adb89ae6/5d0f15d463d73b0a429d17d1_BB-ClimbingDramatic1_PC-NishantShukla.jpg",
    category: "Adventure",
    price: "₹800",
    discount: "20% off",
    visitors: "2800+",
  },
]

export function UpcomingEvents() {
  return (
    <section className="py-16 bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Offers on Activities</h2>
          <Link href="/activities" className="text-accent hover:text-accent/80 font-semibold flex items-center gap-1">
            View All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {event.discount}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-accent font-bold mb-2">{event.category}</p>
                <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{event.title}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{event.visitors} visitors</span>
                  <span className="font-bold text-accent">{event.price}</span>
                </div>
                <Link href="/activities" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
