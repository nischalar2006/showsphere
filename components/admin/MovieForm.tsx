"use client"

import { useState, useEffect } from "react"

interface MovieFormProps {
    onSubmit: (data: any) => void
    initialData?: any
    isEditing: boolean
    onCancel: () => void
    tmdbFetch: (title: string) => Promise<any>
}

export function MovieForm({ onSubmit, initialData, isEditing, onCancel, tmdbFetch }: MovieFormProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        language: "",
        duration: 0,
        release_date: "",
        poster_url: "",
        backdrop_url: "",
        trailer_url: "",
        rating: 0
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                genre: Array.isArray(initialData.genre) ? initialData.genre.join(', ') : (initialData.genre || ""),
                language: initialData.language || "",
                duration: initialData.duration || 0,
                release_date: initialData.release_date || "",
                poster_url: initialData.poster_url || "",
                backdrop_url: initialData.backdrop_url || "",
                trailer_url: initialData.trailer_url || "",
                rating: initialData.rating || 0
            })
        } else {
            setFormData({
                title: "",
                description: "",
                genre: "",
                language: "",
                duration: 0,
                release_date: "",
                poster_url: "",
                backdrop_url: "",
                trailer_url: "",
                rating: 0
            })
        }
    }, [initialData])

    const handleTmdbFetch = async () => {
        if (!formData.title) {
            alert("Please enter a movie title first")
            return
        }
        try {
            const data = await tmdbFetch(formData.title)
            if (data) {
                setFormData({
                    ...formData,
                    title: data.title,
                    description: data.description || "",
                    genre: Array.isArray(data.genre) ? data.genre.join(', ') : (data.genre || ""),
                    language: data.language || "English",
                    duration: data.duration || 0,
                    release_date: data.release_date || "",
                    poster_url: data.poster_url || "",
                    backdrop_url: data.backdrop_url || "",
                    trailer_url: data.trailer_url || "",
                    rating: data.rating || 0
                })
                alert("Movie details fetched from TMDB!")
            }
        } catch (error) {
            console.error("Fetch error", error)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
                <input type="text" placeholder="Title" required className="flex-1 border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <button type="button" onClick={handleTmdbFetch} className="bg-accent text-accent-foreground px-3 py-2 rounded text-sm hover:bg-accent/90 transition-colors whitespace-nowrap">
                    Fetch TMDB
                </button>
            </div>
            <input type="text" placeholder="Genre (comma separated)" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} />
            <input type="text" placeholder="Language" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} />
            <input type="number" placeholder="Duration (min)" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.duration} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} />
            <input type="date" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.release_date} onChange={e => setFormData({ ...formData, release_date: e.target.value })} />
            <input type="number" placeholder="Rating (0-10)" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} />
            <input type="text" placeholder="Poster URL" required className="border border-input bg-secondary text-foreground p-2 rounded md:col-span-2 focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.poster_url} onChange={e => setFormData({ ...formData, poster_url: e.target.value })} />
            <input type="text" placeholder="Backdrop URL" required className="border border-input bg-secondary text-foreground p-2 rounded md:col-span-2 focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.backdrop_url} onChange={e => setFormData({ ...formData, backdrop_url: e.target.value })} />
            <input type="text" placeholder="Trailer URL (YouTube)" className="border border-input bg-secondary text-foreground p-2 rounded md:col-span-2 focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.trailer_url} onChange={e => setFormData({ ...formData, trailer_url: e.target.value })} />
            <textarea placeholder="Description" required className="border border-input bg-secondary text-foreground p-2 rounded md:col-span-2 focus:ring-2 focus:ring-ring focus:outline-none" rows={3}
                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

            <button type="submit" className={`p-2 rounded md:col-span-2 transition-colors ${isEditing ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                {isEditing ? 'Update Movie' : 'Add Movie'}
            </button>
            {isEditing && (
                <button type="button" onClick={onCancel} className="md:col-span-2 text-sm text-muted-foreground hover:text-foreground mt-2">
                    Cancel Edit
                </button>
            )}
        </form>
    )
}
