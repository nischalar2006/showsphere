import { useState, useMemo } from 'react';

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: string;
  language: string;
  [key: string]: any;
}

export function useMovieSearch(movies: Movie[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return movies;

    const query = searchQuery.toLowerCase();
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.language.toLowerCase().includes(query)
    );
  }, [searchQuery, movies]);

  return { searchQuery, setSearchQuery, searchResults };
}
