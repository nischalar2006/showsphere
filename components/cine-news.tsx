"use client"

import Image from "next/image"
import { Calendar, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"

const newsArticles = [
  {
    id: 1,
    title: "Rajinikanth Announces New Action Thriller",
    summary: "Superstar Rajinikanth has officially announced his next project with veteran director Shankar. The film promises high-octane action and mind-bending sci-fi elements.",
    image: "https://tse4.mm.bing.net/th/id/OIP.nwos6_atgU5MHA4TGOVa0wHaD4?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Bollywood",
    date: "2025-01-15",
    readMoreUrl: "https://variety.com",
  },
  {
    id: 2,
    title: "Marvel's Next MCU Film Release Date Confirmed",
    summary: "Marvel Studios has confirmed the release date for their upcoming superhero film. Fans are excited to see the next chapter of the MCU saga.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop",
    category: "Hollywood",
    date: "2025-01-14",
    readMoreUrl: "https://variety.com",
  },
  {
    id: 3,
    title: "Actress Gets Lead Role in International Production",
    summary: "Indian actress Deepika Padukone has been cast in a major international production. This marks her biggest Hollywood venture yet.",
    image: "https://images.herzindagi.info/image/2019/Mar/bollywood-actress-played-lead-role.jpg",
    category: "Celebrity",
    date: "2025-01-13",
    readMoreUrl: "https://variety.com",
  },
  {
    id: 4,
    title: "Box Office Record Broken by Latest Release",
    summary: "The latest action-packed blockbuster has broken all-time box office records in its opening weekend. Industry experts are stunned by the numbers.",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=300&fit=crop",
    category: "Box Office",
    date: "2025-01-12",
    readMoreUrl: "https://variety.com",
  },
]

export function CineNews() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(newsArticles.map(article => article.category)))
  
  const filteredNews = selectedCategory 
    ? newsArticles.filter(article => article.category === selectedCategory)
    : newsArticles

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cinema News</h2>
          <p className="text-muted-foreground text-lg">Stay updated with the latest movie industry news and celebrity updates</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === null
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            All News
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-accent hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">{article.summary}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <a href={article.readMoreUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 hover:bg-transparent">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
