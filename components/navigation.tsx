"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import Link from "next/link"
import { Search, MapPin, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "./profile-dropdown"
import { useAuth } from "@/context/auth-context"
import { useCity } from "@/context/city-context"
import { useRouter, useSearchParams } from 'next/navigation'
import { moviesApi } from "@/lib/api"

interface Movie {
  id: string
  title: string
  poster_url?: string
}

function NavigationContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const { selectedCity, setSelectedCity } = useCity()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get("search")
    if (query) {
      setSearchQuery(query)
    } else {
      setSearchQuery("")
    }
  }, [searchParams])

  // Fetch all movies for local search suggestions
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesApi.getAll()
        setAllMovies(data)
      } catch (error) {
        console.error("Failed to fetch movies for suggestions:", error)
      }
    }
    fetchMovies()
  }, [])

  // Filter movies when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to top 5 suggestions
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, allMovies])

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Goa", "Gurugram"]

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/movies?search=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
      // Note: Do not clear query here, keep it synced with URL via existing useEffect
    } else {
      // logic for empty query if needed
    }
  }

  const handleSuggestionClick = (movie: Movie) => {
    router.push(`/movies/${movie.id}`)
    setSearchQuery(movie.title) // Temporarily set title before nav
    setShowSuggestions(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#2563EB] to-[#1E40AF] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#111827] rounded-lg border border-white/20 flex items-center justify-center">
                <span className="text-[#2563EB] font-bold text-lg">SS</span>
              </div>
              <span className="hidden sm:block text-2xl font-bold tracking-tight text-[#E5E7EB]">
                ShowSphere<span className="text-[#2563EB]">.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-primary-foreground hover:text-accent transition">
                Home
              </Link>
              <Link href="/movies" className="text-primary-foreground hover:text-accent transition">
                Movies
              </Link>
              <Link href="/events" className="text-primary-foreground hover:text-accent transition">
                Events
              </Link>
              <Link href="/activities" className="text-primary-foreground hover:text-accent transition">
                Activities
              </Link>
              <Link href="/cinenews" className="text-primary-foreground hover:text-accent transition">
                News
              </Link>
              <Link href="/trailers/upcoming" className="text-primary-foreground hover:text-accent transition">
                Trailers
              </Link>
            </div>

            {/* Location & Search */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/20 rounded-lg text-primary-foreground border border-primary-foreground/30">
                <MapPin className="w-4 h-4" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-primary text-primary-foreground">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative w-64" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  onFocus={() => { if (searchQuery.trim().length > 0) setShowSuggestions(true) }}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/30 focus:outline-none focus:border-accent"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-50">
                    <ul>
                      {suggestions.map((movie) => (
                        <li
                          key={movie.id}
                          onClick={() => handleSuggestionClick(movie)}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2"
                        >
                          <Search className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium truncate">{movie.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Auth & Mobile Menu */}
            <div className="flex items-center gap-4">
              {user ? (
                <ProfileDropdown />
              ) : (
                <Link href="/login">
                  <Button
                    className="hidden sm:flex bg-white hover:bg-gray-100 text-[#2563EB] font-semibold"
                  >
                    Login
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-4 border-t border-primary-foreground/20">
              <div className="flex flex-col gap-4 pt-4">
                <Link href="/" className="text-primary-foreground hover:text-accent">
                  Home
                </Link>
                <Link href="/movies" className="text-primary-foreground hover:text-accent">
                  Movies
                </Link>
                <Link href="/events" className="text-primary-foreground hover:text-accent">
                  Events
                </Link>
                <Link href="/activities" className="text-primary-foreground hover:text-accent">
                  Activities
                </Link>
                <Link href="/cinenews" className="text-primary-foreground hover:text-accent">
                  News
                </Link>
                <Link href="/trailers/upcoming" className="text-primary-foreground hover:text-accent">
                  Trailers
                </Link>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/20 rounded-lg text-primary-foreground border border-primary-foreground/30">
                  <MapPin className="w-4 h-4" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="flex-1 bg-transparent font-medium focus:outline-none cursor-pointer"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-primary text-primary-foreground">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative pt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 border border-primary-foreground/30 focus:outline-none focus:border-accent"
                  />
                </div>
                {!user && (
                  <Link href="/login" className="w-full">
                    <Button
                      className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

    </>
  )
}

export function Navigation() {
  return (
    <Suspense fallback={<nav className="h-16 md:h-20 bg-primary" />}>
      <NavigationContent />
    </Suspense>
  )
}
