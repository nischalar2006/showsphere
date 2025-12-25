"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from 'lucide-react'
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useCity } from "@/context/city-context"
import { TrailerModal } from "@/components/trailer-modal"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { moviesApi } from "@/lib/api"

interface Movie {
  id: string
  title: string
  poster_url: string
  // Add other fields if needed for gradient/colors, or generate dynamically
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("Delhi")
  const router = useRouter()
  const { setSelectedCity: setCityContext } = useCity()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState({ title: "", videoId: "" })
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Goa", "Gurugram"]

  // Video ID map for demo purposes if we want specific trailers for specific backend movies
  // Just a helper to keep some "demo" feel if real data matches, otherwise generic.
  const trailerMap: Record<string, string> = {
    "Kalki 2898 AD": "kQz-7l35F1I",
    "Oppenheimer": "uYPbbksJxIg",
    "Jawan": "COv52Qyctws"
  }

  // Dynamic color generation helper
  const getGradient = (index: number) => {
    const gradients = [
      "from-amber-900 to-yellow-900",
      "from-orange-900 to-red-900",
      "from-emerald-900 to-teal-900",
      "from-purple-900 to-pink-900",
      "from-blue-900 to-indigo-900"
    ]
    return gradients[index % gradients.length]
  }

  const openTrailer = (title: string) => {
    // Try to find a mapped trailer, or just use a default one/search
    const videoId = trailerMap[title] || ""
    if (videoId) {
      setSelectedTrailer({ title, videoId })
      setIsTrailerOpen(true)
    } else {
      // If no trailer, maybe navigate to details? Or show generic 'Coming Soon'
      // For now let's just not open if no ID, or open a generic one
      // Let's use Kalki as generic fallback for demo
      setSelectedTrailer({ title, videoId: "kQz-7l35F1I" })
      setIsTrailerOpen(true)
    }
  }

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesApi.getAll()
        // Take top 5 for hero
        setMovies(data.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch hero movies", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCityContext(selectedCity)
      router.push(`/movies?search=${encodeURIComponent(searchQuery)}`)
    } else {
      setCityContext(selectedCity)
      router.push("/movies")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (loading) {
    return <div className="h-[500px] w-full bg-muted animate-pulse" />
  }

  return (
    <div className="relative bg-background py-8">
      {/* Carousel Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 mb-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} className="pl-4 md:basis-1/2 lg:basis-2/3">
                <div className={cn(
                  "relative aspect-[2/1] md:aspect-[21/9] overflow-hidden rounded-xl transition-all duration-300 ease-in-out shadow-lg",
                  current === index ? "scale-100 ring-2 ring-primary/20" : "scale-90 opacity-70 blur-[1px]"
                )}>
                  {/* Fallback pattern/gradient if image fails or while loading (simulated with div) */}
                  <div className="absolute inset-0 bg-[#0F172A]">
                    <img
                      src={movie.poster_url || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {/* Cinematic Fade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />

                    <Link href={`/movies/${movie.id}`} className="absolute inset-0 z-0">
                      {/* Empty link to make the whole banner clickable */}
                    </Link>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center z-10 pointer-events-none">
                      <Link href={`/movies/${movie.id}`} className="pointer-events-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg hover:underline decoration-2 underline-offset-4 decoration-primary/50 transition-all">{movie.title}</h2>
                      </Link>
                      <div className="flex gap-4 mt-4 pointer-events-auto">
                        <Button
                          variant="secondary"
                          onClick={() => router.push(`/movies/${movie.id}`)}
                        >
                          Book Now
                        </Button>
                        <Button
                          variant="outline"
                          className="text-white border-white hover:bg-white/20"
                          onClick={() => openTrailer(movie.title)}
                        >
                          Watch Trailer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious className="left-8 bg-black/50 hover:bg-black/70 text-white border-none h-12 w-12" />
            <CarouselNext className="right-8 bg-black/50 hover:bg-black/70 text-white border-none h-12 w-12" />
          </div>

          {/* Dots Indicator */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {movies.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  current === index ? "bg-primary w-6" : "bg-muted-foreground/30"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>

        </Carousel>
      </div>

      {/* Search Section Overlay (or positioned below as per new design flow) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-8 max-w-4xl mx-auto">
          {/* ... existing search structure ... */}
          <div className="grid md:grid-cols-12 gap-4 items-end">

            {/* Location Selector */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-foreground mb-2">City</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors">
                <MapPin className="w-4 h-4 text-primary" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors focus-within:ring-1 focus-within:ring-primary">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for Movies, Events, Plays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-3 flex gap-2">
              <Button
                onClick={handleSearch}
                className="flex-1 bg-primary hover:bg-primary/90 font-semibold"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={selectedTrailer.title}
        youtubeVideoId={selectedTrailer.videoId}
      />
    </div>
  )
}
