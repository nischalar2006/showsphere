'use client';

import { Footer } from '@/components/footer';
import Image from 'next/image';
import { Star, Flame, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const classicMoviesForReRelease = [
  {
    id: 201,
    title: 'Dilwale Dulhania Le Jayenge',
    rating: 'UA 16+',
    duration: '3h 2m',
    language: 'Hindi',
    genre: 'Romance, Comedy',
    image: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p25126_v_h9_ac.jpg',
    rating_score: 9.6,
    booking_id: 'ddlj-classic',
    year: 1995,
    releaseVotes: 0,
  },
  {
    id: 202,
    title: 'Dil Chahta Hai',
    rating: 'UA 16+',
    duration: '2h 43m',
    language: 'Hindi',
    genre: 'Comedy, Drama, Romance',
    image: 'https://cdn.thelivemirror.com/wp-content/uploads/2021/08/Dil-Chahta-Hai.jpg',
    rating_score: 9.4,
    booking_id: 'dch-classic',
    year: 2001,
    releaseVotes: 0,
  },
  {
    id: 203,
    title: 'Rang De Basanti',
    rating: 'UA',
    duration: '2h 47m',
    language: 'Hindi',
    genre: 'Drama, Action',
    image: 'https://tse3.mm.bing.net/th/id/OIP.YPILGYp4X7jJjdbows-0ywHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3',
    rating_score: 9.5,
    booking_id: 'rdb-classic',
    year: 2006,
    releaseVotes: 0,
  },
  {
    id: 204,
    title: '3 Idiots',
    rating: 'U',
    duration: '2h 50m',
    language: 'Hindi',
    genre: 'Comedy, Drama',
    image: 'https://th.bing.com/th/id/OIP.oqA0sSXDH8F_vxzyuwD5_wHaF7?w=226&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    rating_score: 9.4,
    booking_id: '3idiots-classic',
    year: 2009,
    releaseVotes: 0,
  },
  {
    id: 205,
    title: 'Andaaz Apna Apna',
    rating: 'U',
    duration: '2h 40m',
    language: 'Hindi',
    genre: 'Comedy, Romance',
    image: 'https://nenews.in/wp-content/uploads/2025/04/Andaz-Apna-Apna-scaled.jpg',
    rating_score: 8.9,
    booking_id: 'aaa-classic',
    year: 1994,
    releaseVotes: 0,
  },
  {
    id: 206,
    title: 'Chupke Chupke',
    rating: 'U',
    duration: '2h 23m',
    language: 'Hindi',
    genre: 'Comedy, Drama, Romance',
    image: 'https://m.media-amazon.com/images/S/pv-target-images/811a8efa0cbe9d9107d44041627a362a4d7995cd01f7e6271593bcdd60266b59.jpg',
    rating_score: 8.8,
    booking_id: 'cc-classic',
    year: 1975,
    releaseVotes: 0,
  },
];

export default function TrendingPage() {
  const [movies, setMovies] = useState(classicMoviesForReRelease);
  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem('releaseVotes');
    const storedVoteMap = localStorage.getItem('releaseVoteMap');

    if (stored) {
      const parsedVotes = JSON.parse(stored);
      setMovies(parsedVotes);
    }

    if (storedVoteMap) {
      setUserVotes(JSON.parse(storedVoteMap));
    }
  }, []);

  const handleReleaseVote = (movieId: number) => {
    if (userVotes[movieId]) return; // Already voted

    const updatedMovies = movies.map((movie) =>
      movie.id === movieId
        ? { ...movie, releaseVotes: movie.releaseVotes + 1 }
        : movie
    );

    const updatedVoteMap = { ...userVotes, [movieId]: true };

    setMovies(updatedMovies);
    setUserVotes(updatedVoteMap);

    // Save to localStorage
    localStorage.setItem('releaseVotes', JSON.stringify(updatedMovies));
    localStorage.setItem('releaseVoteMap', JSON.stringify(updatedVoteMap));
  };

  const sortedMovies = [...movies].sort((a, b) => b.releaseVotes - a.releaseVotes);

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-foreground">Re-Release Voting Arena</h1>
          </div>
          <p className="text-muted-foreground">Vote for your favorite classic films to bring them back to cinemas</p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMovies.map((movie, index) => (
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

                {/* Re-Release Votes Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-full text-sm font-bold">
                  <Flame className="w-4 h-4 fill-current" />
                  {movie.releaseVotes}
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

                <p className="text-sm text-muted-foreground">{movie.genre}</p>

                <Button
                  onClick={() => handleReleaseVote(movie.id)}
                  disabled={userVotes[movie.id]}
                  className={`w-full font-bold ${userVotes[movie.id]
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    }`}
                >
                  {userVotes[movie.id] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                      Voted
                    </>
                  ) : (
                    'Vote for Re-Release'
                  )}
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
