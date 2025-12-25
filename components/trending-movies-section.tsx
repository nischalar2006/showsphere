'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Flame, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

// Classic/old hit movies metadata (Same as OldHitsPage)
const oldHitMoviesData = [
  {
    id: 101,
    title: 'Sholay',
    year: 1975,
    language: 'Hindi',
    rating_score: 9.5,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUnc_Y9918FioJaV3GE_Mpd4OSLijqgr-WAw&s',
  },
  {
    id: 102,
    title: 'Satya Harishchandra',
    year: 1960,
    language: 'Kannada',
    rating_score: 9.2,
    image: 'https://m.media-amazon.com/images/M/MV5BYzE5MzE5ZDItOTM2ZS00ODgzLWE2ZjAtZTY0OGUxZDMwZDg0XkEyXkFqcGc@._V1_.jpg',
  },
  {
    id: 103,
    title: 'Pather Panchali',
    year: 1955,
    language: 'Bengali',
    rating_score: 9.1,
    image: 'data:image/jpeg;base64,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',
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
  }
];

export function TrendingMoviesSection() {
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
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Re-Release Voting Arena</h2>
          </div>
          <Link href="/old-hits" className="text-accent hover:text-accent/80 font-semibold">
            View All →
          </Link>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Display top 3 movies only for the home page section */}
          {oldHitMoviesData.slice(0, 3).map((movie) => (
            <div
              key={movie.id}
              className="group rounded-xl overflow-hidden bg-gradient-to-b from-[#111827] to-[#0F172A] border border-[#374151] hover:border-[#2563EB] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Image with Vote Badge */}
              <div className="relative h-80 overflow-hidden bg-muted">
                <Image
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Vote Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-full">
                  <Award className="w-4 h-4 fill-current" />
                  <span className="font-bold">{votes[movie.id] || 0} votes</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground line-clamp-2">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {movie.year} • {movie.language}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{movie.rating_score}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg"
                  onClick={() => handleVote(movie)}
                >
                  Cast Your Vote
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
