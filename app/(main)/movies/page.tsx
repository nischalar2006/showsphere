'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { moviesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Footer } from '@/components/footer';

interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  language: string;
  duration: number;
  release_date: string;
  poster_url: string;
  backdrop_url: string;
  rating: number;
  certification?: string;
}

function MoviesContent() {
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'release_date'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  // Handle search query from URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      // Search is handled by filteredAndSortedMovies
    }
  }, [searchParams]);

  const fetchMovies = async () => {
    try {
      const data = await moviesApi.getAll();
      setMovies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique genres and languages
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre?.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [movies]);

  const allLanguages = useMemo(() => {
    const languages = new Set<string>();
    movies.forEach(movie => {
      if (movie.language) languages.add(movie.language);
    });
    return Array.from(languages).sort();
  }, [movies]);

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...movies];

    // Search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.description?.toLowerCase().includes(query) ||
        movie.genre?.some(g => g.toLowerCase().includes(query))
      );
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie =>
        movie.genre?.some(g => selectedGenres.includes(g))
      );
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(movie =>
        selectedLanguages.includes(movie.language)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'release_date':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [movies, selectedGenres, selectedLanguages, sortBy, searchParams]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSortBy('rating');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive text-xl">Error: {error}</div>
      </div>
    );
  }

  const activeFiltersCount = selectedGenres.length + selectedLanguages.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Now Showing</h1>
            <p className="text-muted-foreground">
              {filteredAndSortedMovies.length} {filteredAndSortedMovies.length === 1 ? 'movie' : 'movies'} available
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Toggle Filters Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="title">A-Z</option>
                  <option value="release_date">Latest Release</option>
                </select>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 p-4 bg-card rounded-lg border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genre Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {allGenres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedGenres.includes(genre)
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {allLanguages.map(language => (
                      <button
                        key={language}
                        onClick={() => toggleLanguage(language)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedLanguages.includes(language)
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <Card
                key={movie.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => window.location.href = `/movies/${movie.id}`}
              >
                <div className="relative aspect-[2/3] bg-muted">
                  {movie.poster_url ? (
                    <Image
                      src={movie.poster_url}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-foreground text-4xl font-bold">{movie.title[0]}</span>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-md font-bold text-sm flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    {movie.rating?.toFixed(1) || 'N/A'}
                  </div>

                  {/* Certification Badge */}
                  {movie.certification && (
                    <div className="absolute top-2 left-2 bg-background/90 text-foreground px-2 py-1 rounded text-xs font-bold border border-border">
                      {movie.certification}
                    </div>
                  )}
                </div>

                <CardContent className="p-3">
                  <h3 className="font-bold text-foreground mb-1 line-clamp-1 text-sm md:text-base">
                    {movie.title}
                  </h3>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genre?.slice(0, 2).map((g) => (
                      <span key={g} className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {movie.language} • {movie.duration} mins
                  </p>

                  <Link href={`/movies/${movie.id}`} className="block">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedMovies.length === 0 && (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                {movies.length === 0
                  ? 'No movies available at the moment.'
                  : 'No movies match your filters. Try adjusting your selection.'}
              </div>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    }>
      <MoviesContent />
    </Suspense>
  )
}
