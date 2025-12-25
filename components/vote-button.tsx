'use client';

import { Heart } from 'lucide-react';
import { useMovieVotes } from '@/hooks/use-movie-votes';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';

interface VoteButtonProps {
  movieId: number | string;
  compact?: boolean;
  showFavorite?: boolean;
}

export function VoteButton({ movieId, compact = false, showFavorite = false }: VoteButtonProps) {
  const { voteCount, userVoted, toggleVote } = useMovieVotes(movieId);
  const { isFavorited, toggleFavorite } = useFavorites();

  // If showing favorite functionality
  if (showFavorite) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(movieId);
        }}
        className="p-2 bg-background/80 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
      >
        <Heart
          className={`w-5 h-5 transition-all ${isFavorited(movieId) ? 'fill-red-500 text-red-500' : ''}`}
        />
      </button>
    );
  }

  if (compact) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleVote();
        }}
        className="p-2 bg-background/80 rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
      >
        <Heart
          className={`w-5 h-5 transition-all ${userVoted ? 'fill-accent text-accent' : ''}`}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleVote();
        }}
        variant="outline"
        className={`flex items-center gap-2 ${userVoted
          ? 'bg-accent text-accent-foreground border-accent'
          : 'hover:border-accent hover:text-accent'
          } transition-all duration-300`}
      >
        <Heart
          className={`w-5 h-5 ${userVoted ? 'fill-current' : ''}`}
        />
        <span className="font-semibold">{voteCount}</span>
      </Button>
    </div>
  );
}
