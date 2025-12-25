"use client"

import type React from "react"
import { useState } from "react"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterOptions {
  genres: string[]
  ratings: string[]
  languages: string[]
  sortBy: string
}

interface MovieFiltersProps {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
}

export function MovieFilters({ filters, setFilters }: MovieFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    genre: true,
    rating: true,
    language: true,
  })

  const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Thriller", "Adventure", "Sci-Fi"]
  const ratings = ["UA", "PG", "UA 12+", "UA 16+", "A"]
  const languages = ["Hindi", "English", "Tamil", "Telugu", "Marathi", "Kannada"]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleFilter = (type: keyof Omit<FilterOptions, "sortBy">, value: string) => {
    setFilters({
      ...filters,
      [type]: filters[type].includes(value)
        ? filters[type].filter((item) => item !== value)
        : [...filters[type], value],
    })
  }

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      sortBy: e.target.value,
    })
  }

  const clearAllFilters = () => {
    setFilters({
      genres: [],
      ratings: [],
      languages: [],
      sortBy: "popularity",
    })
  }

  return (
    <div className="sticky top-24 space-y-6">
      {/* Sort */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-semibold text-foreground mb-3">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={handleSort}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating (High to Low)</option>
          <option value="release">Release Date (Newest)</option>
          <option value="rating-low">Rating (Low to High)</option>
        </select>
      </div>

      {/* Genre Filter */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("genre")}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition-colors"
        >
          <h3 className="font-semibold text-foreground">Genre</h3>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              expandedSections.genre ? "" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.genre && (
          <div className="px-4 py-3 space-y-2 border-t border-border bg-background">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.genres.includes(genre)}
                  onChange={() => toggleFilter("genres", genre)}
                  className="w-4 h-4 rounded bg-background border border-border text-accent cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition-colors"
        >
          <h3 className="font-semibold text-foreground">Rating</h3>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              expandedSections.rating ? "" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.rating && (
          <div className="px-4 py-3 space-y-2 border-t border-border bg-background">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.ratings.includes(rating)}
                  onChange={() => toggleFilter("ratings", rating)}
                  className="w-4 h-4 rounded bg-background border border-border text-accent cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">{rating}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Language Filter */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => toggleSection("language")}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition-colors"
        >
          <h3 className="font-semibold text-foreground">Language</h3>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              expandedSections.language ? "" : "-rotate-90"
            }`}
          />
        </button>
        {expandedSections.language && (
          <div className="px-4 py-3 space-y-2 border-t border-border bg-background">
            {languages.map((language) => (
              <label key={language} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(language)}
                  onChange={() => toggleFilter("languages", language)}
                  className="w-4 h-4 rounded bg-background border border-border text-accent cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">{language}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <Button
        onClick={clearAllFilters}
        variant="outline"
        className="w-full text-accent hover:bg-accent/10 bg-transparent"
      >
        Clear All Filters
      </Button>

      {/* Active Filters Summary */}
      {(filters.genres.length > 0 || filters.ratings.length > 0 || filters.languages.length > 0) && (
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <p className="text-xs font-semibold text-accent mb-2">Active Filters</p>
          <div className="flex flex-wrap gap-2">
            {[...filters.genres, ...filters.ratings, ...filters.languages].map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent text-accent-foreground text-xs font-medium"
              >
                {filter}
                <button
                  onClick={() => {
                    if (filters.genres.includes(filter)) toggleFilter("genres", filter)
                    else if (filters.ratings.includes(filter)) toggleFilter("ratings", filter)
                    else if (filters.languages.includes(filter)) toggleFilter("languages", filter)
                  }}
                  className="hover:opacity-70"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
