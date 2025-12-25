"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, MapPin } from "lucide-react"

interface Theater {
    id: number
    name: string
    city: string
    ticket_price?: number // Optional if backend has it, but requirement said API fetch.
}

export default function AdminTheatersPage() {
    const [theaters, setTheaters] = useState<Theater[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        city: ""
    })

    useEffect(() => {
        fetchTheaters()
    }, [])

    const fetchTheaters = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const url = baseUrl.endsWith('/api') ? `${baseUrl}/theaters` : `${baseUrl}/api/theaters`

            const res = await fetch(url)
            const data = await res.json()
            if (Array.isArray(data)) {
                setTheaters(data)
            } else {
                console.error("API returned non-array:", data)
                setTheaters([])
            }
        } catch (error) {
            console.error("Failed to fetch theaters", error)
            setTheaters([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this theater?")) return

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const url = baseUrl.endsWith('/api') ? `${baseUrl}/theaters/${id}` : `${baseUrl}/api/theaters/${id}`

            const res = await fetch(url, {
                method: "DELETE"
            })
            if (res.ok) {
                setTheaters(theaters.filter(t => t.id !== id))
            } else {
                alert("Failed to delete theater")
            }
        } catch (error) {
            console.error("Error deleting theater", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const url = baseUrl.endsWith('/api') ? `${baseUrl}/theaters` : `${baseUrl}/api/theaters`

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Backend expects 'ticketPrice' or such? Requirement said: name, city for Create.
                body: JSON.stringify({ ...formData, ticketPrice: 200 }) // Default price/extra field if needed by schema
            })
            if (res.ok) {
                const newTheater = await res.json()
                setTheaters([...theaters, newTheater])
                setFormData({ name: "", city: "" })
                alert("Theater added successfully")
            } else {
                alert("Failed to add theater")
            }
        } catch (error) {
            console.error("Error adding theater", error)
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-foreground">Manage Theaters</h1>

            {/* Add Theater Form */}
            <div className="bg-card p-6 rounded-lg shadow-md border border-border max-w-2xl">
                <h2 className="text-lg font-semibold mb-4 flex items-center text-foreground"><Plus className="mr-2" size={20} /> Add New Theater</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">Name</label>
                        <input type="text" required className="mt-1 w-full border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground">City</label>
                        <input type="text" required className="mt-1 w-full border border-input bg-secondary text-foreground p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                            value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors">Add Theater</button>
                </form>
            </div>

            {/* Theater List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? <p className="text-muted-foreground">Loading...</p> : theaters.map(theater => (
                    <div key={theater.id} className="bg-card p-4 rounded-lg shadow hover:shadow-md transition-shadow relative border border-border">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-foreground">{theater.name}</h3>
                                <p className="text-muted-foreground flex items-center mt-1"><MapPin size={16} className="mr-1" /> {theater.city}</p>
                            </div>
                            <button onClick={() => handleDelete(theater.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
