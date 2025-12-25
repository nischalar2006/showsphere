'use client';

import { Footer } from '@/components/footer';
import Image from 'next/image';
import { Star, Award, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

// Classic/old hit movies metadata
const oldHitMoviesData = [
  {
    id: 101,
    title: 'Sholay',
    year: 1975,
    language: 'Hindi',
    rating_score: 9.5,
    image: 'https://upload.wikimedia.org/wikipedia/en/d/da/Sholay_Poster.jpg',
  },
  {
    id: 102,
    title: 'Mughal-e-Azam',
    year: 1960,
    language: 'Hindi',
    rating_score: 9.2,
    image: 'https://upload.wikimedia.org/wikipedia/en/8/8e/Mughal_e_Azam.jpg',
  },
  {
    id: 103,
    title: 'Pather Panchali',
    year: 1955,
    language: 'Bengali',
    rating_score: 9.1,
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Pather_Panchali_%281955%29.jpg',
  },
  {
    id: 104,
    title: 'Guide',
    year: 1965,
    language: 'Hindi',
    rating_score: 8.9,
    image: 'https://upload.wikimedia.org/wikipedia/en/c/cf/Guide_%281965%29.jpg',
  },
  {
    id: 105,
    title: 'Lagaan',
    year: 2001,
    language: 'Hindi',
    rating_score: 8.8,
    image: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Lagaan_poster.jpg',
  },
  {
    id: 106,
    title: 'Hera Pheri',
    year: 2000,
    language: 'Hindi',
    rating_score: 8.7,
    image: 'https://upload.wikimedia.org/wikipedia/en/a/a1/Hera_Pheri.jpg',
  },
];

export default function OldHitsPage() {
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const getApiUrl = (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    return baseUrl.endsWith('/api') ? `${baseUrl}/${endpoint}` : `${baseUrl}/api/${endpoint}`
  }

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const res = await fetch(getApiUrl('votes'));
      if (res.ok) {
        const data = await res.json();
        const voteMap: Record<number, number> = {};
        data.forEach((v: any) => {
          voteMap[v.movie_id] = v.vote_count;
        });
        setVotes(voteMap);
      }
    } catch (error) {
      console.error("Failed to fetch votes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (movie: any) => {
    if (!user) {
      alert("Please login to vote!");
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(getApiUrl('votes/vote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_id: movie.id, title: movie.title })
      });

      if (res.ok) {
        const updated = await res.json();
        setVotes(prev => ({
          ...prev,
          [movie.id]: updated.vote_count
        }));
        alert(`Voted for ${movie.title}!`);
      } else {
        alert("Failed to cast vote.");
      }
    } catch (error) {
      console.error("Error voting", error);
      alert("Error casting vote");
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Old Hits Voting Arena</h1>
          </div>
          <p className="text-muted-foreground">Vote for classic films that defined cinema</p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {oldHitMoviesData.map((movie) => (
            <div
              key={movie.id}
              className="group rounded-xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden bg-muted">
                <Image
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Year Badge */}
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                  {movie.year}
                </div>

                {/* Votes Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-bold shadow-md">
                  <Award className="w-4 h-4 fill-current" />
                  {votes[movie.id] || 0} Votes
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {movie.year} • {movie.language}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold">{movie.rating_score}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all active:scale-95"
                  onClick={() => handleVote(movie)}
                >
                  Cast Your Vote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
