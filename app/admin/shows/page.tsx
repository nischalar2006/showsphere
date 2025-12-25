"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Calendar, DollarSign } from "lucide-react"

interface Show {
    id: number
    movie_id: number
    theater_id: number
    show_time: string
    price: number
    movie?: { title: string } // Joined data if available, else fetch separately or assume ID match
    theater?: { name: string }
}

interface Movie {
    id: number
    title: string
}

interface Theater {
    id: number
    name: string
}

export default function AdminShowsPage() {
    const [shows, setShows] = useState<Show[]>([])
    const [movies, setMovies] = useState<Movie[]>([])
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [formData, setFormData] = useState({
        movie_id: "",
        theater_id: "",
        show_time: "",
        price: ""
    })

    useEffect(() => {
        Promise.all([fetchShows(), fetchMovies(), fetchTheaters()])
            .then(() => setIsLoading(false))
    }, [])

    const getApiUrl = (endpoint: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        return baseUrl.endsWith('/api') ? `${baseUrl}/${endpoint}` : `${baseUrl}/api/${endpoint}`
    }

    const fetchShows = async () => {
        try {
            const res = await fetch(getApiUrl('shows'))
            const data = await res.json()
            setShows(Array.isArray(data) ? data : [])
        } catch (error) { console.error("Error fetching shows", error) }
    }

    const fetchMovies = async () => {
        try {
            const res = await fetch(getApiUrl('movies'))
            const data = await res.json()
            setMovies(Array.isArray(data) ? data : [])
        } catch (error) { console.error("Error fetching movies", error) }
    }

    const fetchTheaters = async () => {
        try {
            const res = await fetch(getApiUrl('theaters'))
            const data = await res.json()
            setTheaters(Array.isArray(data) ? data : [])
        } catch (error) { console.error("Error fetching theaters", error) }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this show?")) return
        try {
            const res = await fetch(getApiUrl(`shows/${id}`), { method: "DELETE" })
            if (res.ok) setShows(shows.filter(s => s.id !== id))
        } catch (error) { console.error("Deletion failed", error) }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(getApiUrl('shows'), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    movie_id: formData.movie_id, // backend likely handles standard uuid string or we might need simple string
                    theater_id: formData.theater_id,
                    start_time: formData.show_time, // Backend expects start_time
                    price: Number(formData.price)
                })
            })
            if (res.ok) {
                const newShow = await res.json()
                fetchShows()
                setFormData({ movie_id: "", theater_id: "", show_time: "", price: "" })
                alert("Show added successfully")
            } else {
                alert("Failed to add show")
            }
        } catch (error) { console.error("Submission failed", error) }
    }

    // Helper to find names if backend doesn't join
    const getMovieName = (id: number) => movies.find(m => m.id === id)?.title || `Movie #${id}`
    const getTheaterName = (id: number) => theaters.find(t => t.id === id)?.name || `Theater #${id}`

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-foreground">Manage Shows</h1>

            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-foreground"><Plus className="mr-2" size={20} /> Add New Show</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                        value={formData.movie_id} onChange={e => setFormData({ ...formData, movie_id: e.target.value })}>
                        <option value="">Select Movie</option>
                        {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                    </select>

                    <select required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                        value={formData.theater_id} onChange={e => setFormData({ ...formData, theater_id: e.target.value })}>
                        <option value="">Select Theater</option>
                        {theaters.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>

                    <input type="datetime-local" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                        value={formData.show_time} onChange={e => setFormData({ ...formData, show_time: e.target.value })} />

                    <input type="number" placeholder="Price" required className="border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />

                    <button type="submit" className="md:col-span-2 bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors">Add Show</button>
                </form>
            </div>

            <div className="space-y-4">
                {isLoading ? <p className="text-muted-foreground">Loading...</p> : shows.map(show => (
                    <div key={show.id} className="bg-card p-4 rounded shadow flex justify-between items-center border border-border">
                        <div>
                            <h3 className="font-bold text-lg text-foreground">{show.movie?.title || getMovieName(show.movie_id)}</h3>
                            <p className="text-muted-foreground">{show.theater?.name || getTheaterName(show.theater_id)}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(show.show_time).toLocaleString()}</span>
                                <span className="flex items-center"><DollarSign size={14} className="mr-1" /> ${show.price}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(show.id)} className="text-destructive hover:text-destructive/80 bg-secondary p-2 rounded-full transition-colors">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
