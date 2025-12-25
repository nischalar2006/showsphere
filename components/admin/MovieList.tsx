"use client"

import { Edit, Trash2 } from 'lucide-react'

interface Movie {
    id: number
    title: string
    genre: string | string[]
    poster_url: string
}

interface MovieListProps {
    movies: Movie[]
    onEdit: (movie: any) => void
    onDelete: (id: number) => void
    isLoading: boolean
}

export function MovieList({ movies, onEdit, onDelete, isLoading }: MovieListProps) {
    if (isLoading) {
        return <p className="text-muted-foreground">Loading...</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
                <div key={movie.id} className="bg-card rounded-lg shadow overflow-hidden relative group border border-border">
                    <img src={movie.poster_url} alt={movie.title} className="w-full h-64 object-cover" />
                    <div className="p-4">
                        <h3 className="font-bold truncate text-foreground">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                        </p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(movie)}
                            className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => onDelete(movie.id)}
                            className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
