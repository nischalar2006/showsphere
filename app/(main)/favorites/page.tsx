"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { MovieGrid } from "@/components/movie-grid"
import { Heart, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"

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
  },
  {
    id: 3,
    title: "Love Stories",
    rating: "PG",
    duration: "2h 5m",
    language: "Hindi",
    genre: "Romance, Comedy",
    image: "https://marketplace.canva.com/EAFMq1PnMF0/1/0/1131w/canva-black-minimalist-love-story-movie-poster-Vzujes4EjVY.jpg",
    rating_score: 7.8,
    booking_id: "love-stories-booking",
    format: "2D",
    releaseDate: "Now Showing",
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
  },
]

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [favoriteMovies, setFavoriteMovies] = useState<typeof allMovies>([])

  useEffect(() => {
    const favs = allMovies.filter(movie => favorites.includes(movie.id))
    setFavoriteMovies(favs)
  }, [favorites])

  return (
    <div className="min-h-screen bg-background">

      <div className="bg-primary text-primary-foreground py-6 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/movies" className="hover:text-accent transition">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 fill-accent text-accent" />
              <h1 className="text-3xl font-bold">My Favorite Movies</h1>
            </div>
          </div>
          <p className="text-primary-foreground/80 mt-2">{favorites.length} movies saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {favoriteMovies.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Heart className="w-16 h-16 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground text-lg">No favorite movies yet!</p>
            <p className="text-sm text-muted-foreground mt-2">Start adding your favorite movies to see them here.</p>
            <Link href="/movies" className="inline-block mt-6 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-lg font-bold transition">
              Browse Movies
            </Link>
          </div>
        ) : (
          <MovieGrid filters={{ genres: [], ratings: [], languages: [], sortBy: "popularity" }} />
        )}
      </div>
    </div>
  )
}
