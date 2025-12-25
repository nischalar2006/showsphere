"use client"

import { Footer } from "@/components/footer"
import { CineNews } from "@/components/cine-news"

export default function CineNewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Latest Cinema News</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Get the latest updates on movies, celebrities, and box office trends from around the world.
        </p>
      </div>
      <CineNews />
      <Footer />
    </div>
  )
}
