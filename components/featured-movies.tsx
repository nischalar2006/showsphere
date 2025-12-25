"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { moviesApi } from "@/lib/api"
import { getMovieCertification } from '@/lib/movie-utils';

interface Movie {
  id: string
  title: string
  rating: number // numeric in DB
  duration: number // numeric in DB
  language: string
  genre: string[]
  poster_url: string
}

export function FeaturedMovies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await moviesApi.getAll()
        // Filter for specific featured movies to match design
        const featuredTitles = ["Thamma", "Kantara Chapter-1", "SatyaPrem Ki Katha", "Kaantha"]
        const featured = allMovies.filter((m: any) => featuredTitles.includes(m.title))

        // If we found them, use them. Otherwise just take the first 4.
        if (featured.length > 0) {
          setMovies(featured)
        } else {
          setMovies(allMovies.slice(0, 4))
        }
      } catch (error) {
        console.error("Failed to fetch featured movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return <div className="py-16 text-center">Loading detailed movies...</div>
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Now Showing</h2>
          <Link href="/movies" className="text-accent hover:text-accent/80 font-semibold">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => window.location.href = `/movies/${movie.id}`}
              className="group rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden bg-muted">
                <Image
                  src={movie.poster_url || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Heart Icon */}
                <button
                  onClick={(e) => { e.stopPropagation(); /* Add logic */ }}
                  className="absolute top-4 right-4 p-2 bg-background/80 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg line-clamp-2">{movie.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getMovieCertification(movie.title)} • {movie.language}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-lg whitespace-nowrap">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{movie.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</p>
                <p className="text-xs text-muted-foreground mb-4">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg">
                  Book Tickets
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
