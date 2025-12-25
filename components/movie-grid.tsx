"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Play, Heart, Clock, Film } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { VoteButton } from '@/components/vote-button';
import { useSearchParams } from 'next/navigation'
import { TrailerModal } from '@/components/trailer-modal'

const allMovies = [
  {
    id: 1,
    title: "Thamma",
    rating: "UA16+",
    duration: "2h 30m",
    language: "Hindi",
    genre: "Action, Drama",
    image: "https://stat4.bollywoodhungama.in/wp-content/uploads/2025/09/Thamma.jpg",
    rating_score: 8.5,
    booking_id: "thamma-booking",
    format: "2D, 3D",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "Mod_oXpftJA?si=SZ1IbRN3TgYLG831",
    ottPlatforms: [],
  },
  {
    id: 2,
    title: "The Summit",
    rating: "UA",
    duration: "2h 15m",
    language: "English",
    genre: "Adventure, Drama",
    image: "https://tse2.mm.bing.net/th/id/OIP.v5ocK0CB2Dc8aVt38eDLTAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    rating_score: 8.2,
    booking_id: "summit-booking",
    format: "2D, IMAX",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "kV6iZRvilwc?si=QMwCbuqWgfHfLBku",
    ottPlatforms: [],
  },
  {
    id: 3,
    title: "SatyaPrem Ki Katha",
    rating: "PG",
    duration: "2h 25m",
    language: "Hindi",
    genre: "Romance, Comedy",
    image: "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/7e6e23120dffa1b0525a886ebb06c6b4b39e13bb4ea37d6b36254b70fef55141._RI_TTW_.jpg",
    rating_score: 7.8,
    booking_id: "love-stories-booking",
    format: "2D",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "8EPJiFfWRfw?si=I9fcG9g9M3POKN9_",
    ottPlatforms: [],
  },
  {
    id: 4,
    title: "Predator:Badlands",
    rating: "A",
    duration: "1h 47m",
    language: "English, Hindi",
    genre: "Action, Thriller",
    image: "https://tse1.mm.bing.net/th/id/OIP.iTvtyXlh8hw8Pn8YnksFSAHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    rating_score: 8.7,
    booking_id: "predator-booking",
    format: "2D, 3D, 4DX, IMAX",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "43R9l7EkJwE?si=rgX4ZnGx1u-RtUHm",
    ottPlatforms: [],
  },
  {
    id: 5,
    title: "Love OTP",
    rating: "UA 16+",
    duration: "2h 20m",
    language: "Kannada, Telugu",
    genre: "Comedy,Romantic",
    image: "https://media.newindianexpress.com/newindianexpress/2025-02-17/eiwa50h1/will-be-shot.jpg?w=1200&ar=40:21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100",
    rating_score: 9.8,
    booking_id: "loveotp-booking",
    format: "2D",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "ABwJ9VmqAwU?si=zrd_B3oNeOZVPk7g",
    ottPlatforms: [],
  },
  {
    id: 6,
    title: "The Running Man",
    rating: "A",
    duration: "2h 14m",
    language: "English",
    genre: "Action, Thriller",
    image: "https://posterspy.com/wp-content/uploads/2023/08/THERUNNINGMAN.jpg",
    rating_score: 7.7,
    booking_id: "runningman-booking",
    format: "2D, 4DX, IMAX",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "KD18ddeFuyM?si=q_6_4C4Ro2Az_jig",
    ottPlatforms: ["Hotstar", "JioCinema"],
  },
  {
    id: 7,
    title: "Kaantha",
    rating: "UA 12+",
    duration: "2h 43m",
    language: "Tamil, Telugu",
    genre: "Drama, Thriller",
    image: "https://m.media-amazon.com/images/M/MV5BNmYxM2Q2YTktNDE4OC00MTNhLWI2NDUtZjQxZjk1ZTQzNGFhXkEyXkFqcGc@._V1_.jpg",
    rating_score: 8.2,
    booking_id: "Kaantha-booking",
    format: "2D, 3D, IMAX",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "jC6M3-6rhM0?si=y_kDzedfc4mkawCI",
    ottPlatforms: [],
  },
  {
    id: 8,
    title: "Kantara Chapter-1",
    rating: "UA 16+",
    duration: "2h 48m",
    language: "Kannada",
    genre: "Adventure,Drama,Thriller",
    image: "https://cdn.gulte.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-27-at-12.44.10-PM.jpeg",
    rating_score: 9.3,
    booking_id: "Kantara-booking",
    format: "2D, 4DX, IMAX",
    releaseDate: "Now Showing",
    inTheaters: true,
    trailerVideoId: "TMQUFhWm8C0?si=G2VWYhaNzIWPT0Qa",
    ottPlatforms: [],
  },
]

interface MovieGridProps {
  filters: {
    genres: string[]
    ratings: string[]
    languages: string[]
    sortBy: string
  }
}

export function MovieGrid({ filters }: MovieGridProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')?.toLowerCase() || ''
  const [selectedTrailer, setSelectedTrailer] = useState<any>(null)

  const filteredAndSortedMovies = useMemo(() => {
    let result = allMovies

    if (searchQuery) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery) ||
        movie.genre.toLowerCase().includes(searchQuery) ||
        movie.language.toLowerCase().includes(searchQuery)
      )
    }

    if (filters.genres.length > 0) {
      result = result.filter((movie) =>
        filters.genres.some((genre) => movie.genre.toLowerCase().includes(genre.toLowerCase())),
      )
    }

    if (filters.ratings.length > 0) {
      result = result.filter((movie) => filters.ratings.includes(movie.rating))
    }

    if (filters.languages.length > 0) {
      result = result.filter((movie) => filters.languages.includes(movie.language))
    }

    switch (filters.sortBy) {
      case "rating":
        result = [...result].sort((a, b) => b.rating_score - a.rating_score)
        break
      case "rating-low":
        result = [...result].sort((a, b) => a.rating_score - b.rating_score)
        break
      case "popularity":
      default:
        break
    }

    return result
  }, [filters, searchQuery])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredAndSortedMovies.length}</span> of{" "}
          <span className="font-semibold text-foreground">{allMovies.length}</span> movies
          {searchQuery && <span className="ml-2">for "{searchQuery}"</span>}
        </p>
      </div>

      {filteredAndSortedMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMovies.map((movie) => (
            <div key={movie.id}>
              {movie.inTheaters ? (
                <Link href={`/booking/${movie.booking_id}`}>
                  <div className="group rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-80 overflow-hidden bg-muted">
                      <Image
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                        <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{movie.rating_score}</span>
                      </div>

                      {/* Format Badge */}
                      <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-foreground">
                        {movie.format.split(",")[0].trim()}
                      </div>

                      {/* Vote Button - Top Left */}
                      <div className="absolute top-3 left-3">
                        <VoteButton movieId={movie.id} compact />
                      </div>

                      {/* Favorite Heart Button - Bottom Right */}
                      <div className="absolute bottom-3 right-3" onClick={(e) => e.preventDefault()}>
                        <VoteButton movieId={movie.id} compact showFavorite />
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="mb-3">
                        <h3 className="font-bold text-foreground text-lg line-clamp-2 mb-1">{movie.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {movie.rating} • {movie.language}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{movie.genre}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{movie.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-auto">
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedTrailer(movie)
                          }}
                          variant="outline"
                          className="w-full border-accent text-accent hover:bg-accent/10"
                        >
                          <Film className="w-4 h-4 mr-2" />
                          Watch Trailer
                        </Button>
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg">
                          Book Tickets
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="group rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer">
                  {/* Image Container */}
                  <div className="relative h-80 overflow-hidden bg-muted">
                    <Image
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{movie.rating_score}</span>
                    </div>

                    {/* Format Badge */}
                    <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-foreground">
                      Out of Theaters
                    </div>

                    {/* Vote Button - Top Left */}
                    <div className="absolute top-3 left-3">
                      <VoteButton movieId={movie.id} compact />
                    </div>

                    {/* Favorite Heart Button - Bottom Right */}
                    <div className="absolute bottom-3 right-3" onClick={(e) => e.preventDefault()}>
                      <VoteButton movieId={movie.id} compact showFavorite />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="font-bold text-foreground text-lg line-clamp-2 mb-1">{movie.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {movie.rating} • {movie.language}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{movie.genre}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{movie.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <div className="text-xs font-semibold text-foreground mb-2">Available On:</div>
                      <div className="flex flex-wrap gap-2">
                        {movie.ottPlatforms.map((platform) => (
                          <span
                            key={platform}
                            className="inline-block px-2 py-1 bg-accent/20 text-accent text-xs font-bold rounded"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedTrailer(movie)
                        }}
                        className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg"
                      >
                        <Film className="w-4 h-4 mr-2" />
                        Watch Trailer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTrailer && (
        <TrailerModal
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
          movieTitle={selectedTrailer.title}
          youtubeVideoId={selectedTrailer.trailerVideoId}
        />
      )}
    </div>
  )
}
