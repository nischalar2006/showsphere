import { useState, useEffect } from 'react';

export interface MovieVote {
  movieId: number | string;
  voteCount: number;
  userVoted: boolean;
}

export function useMovieVotes(movieId: number | string) {
  const [votes, setVotes] = useState<MovieVote>({
    movieId,
    voteCount: Math.floor(Math.random() * 5000) + 1000,
    userVoted: false,
  });

  // Load votes from localStorage
  useEffect(() => {
    const storedVotes = localStorage.getItem(`movie-votes-${movieId}`);
    const votedMovies = JSON.parse(localStorage.getItem('voted-movies') || '[]');

    if (storedVotes) {
      setVotes(JSON.parse(storedVotes));
    }

    if (votedMovies.includes(movieId)) {
      setVotes((prev) => ({ ...prev, userVoted: true }));
    }
  }, [movieId]);

  const toggleVote = () => {
    setVotes((prev) => {
      const newVotes = {
        ...prev,
        voteCount: prev.userVoted ? prev.voteCount - 1 : prev.voteCount + 1,
        userVoted: !prev.userVoted,
      };
      localStorage.setItem(`movie-votes-${movieId}`, JSON.stringify(newVotes));

      const votedMovies = JSON.parse(localStorage.getItem('voted-movies') || '[]');
      if (newVotes.userVoted) {
        if (!votedMovies.includes(movieId)) {
          votedMovies.push(movieId);
        }
      } else {
        const index = votedMovies.indexOf(movieId);
        if (index > -1) {
          votedMovies.splice(index, 1);
        }
      }
      localStorage.setItem('voted-movies', JSON.stringify(votedMovies));

      return newVotes;
    });
  };

  return { ...votes, toggleVote };
}
