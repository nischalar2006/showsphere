"use client"

import { useState, useEffect } from "react"
import { Plus, Edit } from 'lucide-react'
import { MovieForm } from "@/components/admin/MovieForm"
import { MovieList } from "@/components/admin/MovieList"

interface Movie {
    id: number
    title: string
    description: string
    genre: string
    language: string
    duration: number
    release_date: string
    poster_url: string
    backdrop_url: string
    trailer_url?: string
    rating: number
}

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null)

    const getApiUrl = (endpoint: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        return baseUrl.endsWith('/api') ? `${baseUrl}/${endpoint}` : `${baseUrl}/api/${endpoint}`
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async () => {
        try {
            const url = getApiUrl('movies')
            const res = await fetch(url)
            const data = await res.json()
            if (Array.isArray(data)) {
                setMovies(data)
            } else {
                setMovies([])
            }
        } catch (error) {
            console.error("Failed to fetch movies", error)
            setMovies([])
        } finally {
            setIsLoading(false)
        }
    }

    const tmdbFetch = async (title: string) => {
        try {
            const url = getApiUrl(`tmdb/search-movie?title=${encodeURIComponent(title)}`)
            const res = await fetch(url)
            const data = await res.json()
            if (res.ok) {
                return data
            } else {
                alert(data.error || "Failed to fetch from TMDB")
                return null
            }
        } catch (error) {
            console.error("TMDB Fetch Error", error)
            alert("Error fetching data")
            return null
        }
    }

    const handleSubmit = async (formData: any) => {
        const payload = {
            ...formData,
            genre: typeof formData.genre === 'string'
                ? formData.genre.split(',').map((g: string) => g.trim())
                : formData.genre
        }

        try {
            const url = editingId
                ? `${getApiUrl('movies')}/${editingId}`
                : getApiUrl('movies')

            const method = editingId ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                fetchMovies()
                setEditingId(null)
                setEditingMovie(null)
                alert(editingId ? 'Movie updated successfully' : 'Movie added successfully')
            } else {
                alert('Failed to save movie')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleEdit = (movie: Movie) => {
        setEditingId(movie.id)
        setEditingMovie(movie)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return
        try {
            await fetch(`${getApiUrl('movies')}/${id}`, { method: 'DELETE' })
            fetchMovies()
        } catch (error) {
            console.error(error)
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditingMovie(null)
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-foreground">Manage Movies</h1>

            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold flex items-center text-foreground">
                        {editingId ? <Edit className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
                        {editingId ? 'Edit Movie' : 'Add New Movie'}
                    </h2>
                </div>

                <MovieForm
                    onSubmit={handleSubmit}
                    initialData={editingMovie}
                    isEditing={!!editingId}
                    onCancel={cancelEdit}
                    tmdbFetch={tmdbFetch}
                />
            </div>

            <MovieList
                movies={movies}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />
        </div>
    )
}
