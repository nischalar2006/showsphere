import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<(number | string)[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorite-movies') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (movieId: number | string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId];
      localStorage.setItem('favorite-movies', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorited = (movieId: number | string) => favorites.includes(movieId);

  return { favorites, toggleFavorite, isFavorited };
}
