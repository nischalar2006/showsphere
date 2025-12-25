import { HeroSection } from "@/components/hero-section"
import { FeaturedMovies } from "@/components/featured-movies"
import { TrendingMoviesSection } from "@/components/trending-movies-section"
import { CineNews } from "@/components/cine-news"
import { UpcomingEvents } from "@/components/upcoming-events"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedMovies />
      <TrendingMoviesSection />
      <CineNews />
      <UpcomingEvents />
      <Footer />
    </div>
  )
}
