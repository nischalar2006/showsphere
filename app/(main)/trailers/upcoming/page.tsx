"use client"

import { Footer } from "@/components/footer"
import Image from "next/image"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Play, Calendar, Bell } from 'lucide-react'
import { TrailerModal } from "@/components/trailer-modal"

const upcomingMovies = [
  {
    id: 1,
    title: "Avatar: Fire and Ash",
    image: "https://i.ytimg.com/vi/Ma1x7ikpid8/maxresdefault.jpg",
    releaseDate: "2025-03-15",
    youtubeVideoId: "nb_fFj_0rq8?si=c2Kda4ab8h4GgNMU",
    director: "James Cameron",
    cast: "Sam Worthington, Zoe Saldana",
  },
  {
    id: 2,
    title: "Deadpool & Wolverine 2",
    image: "https://s3.cine3.com/2024/06/deadpool-and-wolverine-poster-reald-3d.jpg",
    releaseDate: "2025-04-20",
    youtubeVideoId: "73_1biulkYk?si=v3cKYrRJFn7Q1JCd",
    director: "Shawn Levy",
    cast: "Ryan Reynolds, Hugh Jackman",
  },
  {
    id: 3,
    title: "The Fantastic Four",
    image: "https://th.bing.com/th/id/R.84ae57193e84a6f73029e1d181b992c0?rik=gHUUdVEoWW51Hw&riu=http%3a%2f%2f4kwallpapers.com%2fimages%2fwalls%2fthumbs_2t%2f23263.jpg&ehk=oYlUMR1ArYjly6luOPAfj4Yv0aOgntlUP3A3u3ZT7UQ%3d&risl=&pid=ImgRaw&r=0",
    releaseDate: "2025-05-10",
    youtubeVideoId: "18QQWa5MEcs?si=-QAEQx70ce-OUWyp",
    director: "Matt Reeves",
    cast: "Pedro Pascal, Vanessa Kirby",
  },
  {
    id: 4,
    title: "Avengers: Secret Wars",
    image: "https://tse3.mm.bing.net/th/id/OIP.8cjAzbwWzgtzJ21lEcieNwHaJP?rs=1&pid=ImgDetMain&o=7&rm=3",
    releaseDate: "2025-06-30",
    youtubeVideoId: "3n5u-zWC4mY?si=GtryuSZfUqW6vIqe",
    director: "Anthony Russo",
    cast: "Ensemble Cast",
  },
]

export default function UpcomingTrailersPage() {
  const [selectedTrailer, setSelectedTrailer] = useState<(typeof upcomingMovies)[0] | null>(null)
  const [notifiedMovies, setNotifiedMovies] = useState<number[]>([])

  const daysUntilRelease = (releaseDate: string) => {
    const release = new Date(releaseDate)
    const today = new Date()
    const diff = release.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const handleNotifyMe = (movieId: number) => {
    setNotifiedMovies([...notifiedMovies, movieId])
    setTimeout(() => {
      setNotifiedMovies(notifiedMovies.filter(id => id !== movieId))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Upcoming Movie Trailers</h1>
          <p className="text-lg text-muted-foreground">
            Watch the latest trailers for upcoming blockbuster releases and don't miss any major premiere.
          </p>
        </div>
      </div>

      {/* Trailers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingMovies.map((movie) => {
            const days = daysUntilRelease(movie.releaseDate)
            const isNotified = notifiedMovies.includes(movie.id)

            return (
              <div key={movie.id} className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent transition-all duration-300 shadow-lg hover:shadow-xl">
                {/* Poster Image */}
                <div className="relative h-80 overflow-hidden bg-muted group cursor-pointer">
                  <Image
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                    <button
                      onClick={() => setSelectedTrailer(movie)}
                      className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors transform group-hover:scale-110"
                    >
                      <Play className="w-8 h-8 fill-current" />
                    </button>
                  </div>

                  {/* Release Countdown Badge */}
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-2 rounded-lg font-bold text-sm">
                    {days} days
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      <span className="font-semibold">Director:</span> {movie.director}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Cast:</span> {movie.cast}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setSelectedTrailer(movie)}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Trailer
                    </Button>
                    <Button
                      onClick={() => handleNotifyMe(movie.id)}
                      variant="outline"
                      className="flex-1"
                      disabled={isNotified}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {isNotified ? "Notified!" : "Notify Me"}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <TrailerModal
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
          movieTitle={selectedTrailer.title}
          youtubeVideoId={selectedTrailer.youtubeVideoId}
        />
      )}

      <Footer />
    </div>
  )
}
