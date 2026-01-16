"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { moviesApi, showsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Film, CalendarDays } from "lucide-react"

interface Movie {
    id: string
    title: string
}

interface Theater {
    id: string
    name: string
    city: string; // From schema
    location: string; // From schema
}

interface Show {
    id: string
    start_time: string
    price: number
    theater_id: string
    theaters: Theater
}

// Helper to format time
const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper to format date display
const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return "Select Date";
    // Assuming dateString is ISO or parsable
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ShowtimesContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const movieId = searchParams.get("movie_id")
    const selectedDateParam = searchParams.get("date") // ISO string expected

    const [movie, setMovie] = useState<Movie | null>(null)
    const [shows, setShows] = useState<Show[]>([])
    const [loading, setLoading] = useState(true)
    const [groupedShows, setGroupedShows] = useState<Record<string, { theater: Theater, shows: Show[] }>>({})

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!movieId) return
            try {
                setLoading(true)
                const [movieData, allShows] = await Promise.all([
                    moviesApi.getById(movieId),
                    showsApi.getAll({ movie_id: movieId })
                ])

                setMovie(movieData)

                // Filter shows by selected date
                let filteredShows = allShows;
                if (selectedDateParam) {
                    const targetDate = new Date(selectedDateParam).toDateString();
                    filteredShows = allShows.filter((show: Show) => {
                        const showDate = new Date(show.start_time).toDateString();
                        return showDate === targetDate;
                    })
                }

                setShows(filteredShows as Show[])

            } catch (error) {
                console.error("Failed to fetch data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [movieId, selectedDateParam])

    // Group Shows by Theater
    useEffect(() => {
        const grouped: Record<string, { theater: Theater, shows: Show[] }> = {};

        shows.forEach(show => {
            const theaterId = show.theater_id;
            if (!grouped[theaterId]) {
                grouped[theaterId] = {
                    theater: show.theaters,
                    shows: []
                };
            }
            grouped[theaterId].shows.push(show);
        });

        // Sort shows inside each theater by time
        Object.keys(grouped).forEach(key => {
            grouped[key].shows.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        });

        setGroupedShows(grouped);

    }, [shows])

    const handleShowSelect = (show: Show) => {
        // Navigate to seat selection
        router.push(`/booking/seats?show_id=${show.id}&movie_id=${movieId}&price=${show.price}`)
    }

    const handleDateChange = () => {
        router.back();
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#0f172a] to-[#1e293b] text-slate-100 pb-20 selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">

                {/* Page Title */}
                <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 mb-8 drop-shadow-sm">
                    Book Tickets
                </h1>

                <div className="space-y-6">

                    {/* Movie Name Section */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-black/10">
                        <Film className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-slate-100 tracking-wide">
                            {movie ? movie.title : "Movie"}
                        </h2>
                    </div>

                    {/* Date Info Row */}
                    <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/50 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-3 text-slate-300">
                            <CalendarDays className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">Shows for {formatDateDisplay(selectedDateParam)}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDateChange}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 h-8 text-xs sm:text-sm"
                        >
                            Change Date
                        </Button>
                    </div>

                    {/* Theatre List Container */}
                    <div className="space-y-4 mt-8">
                        {Object.keys(groupedShows).length === 0 ? (
                            <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                                <p className="text-slate-500">No shows available for this date.</p>
                                <Button variant="link" className="text-blue-500 mt-2" onClick={handleDateChange}>Pick another date</Button>
                            </div>
                        ) : (
                            Object.values(groupedShows).map(({ theater, shows }) => (
                                <div key={theater.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-black/20 hover:border-slate-600/50 transition-all">
                                    {/* Theater Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                                {theater.name}
                                                {/* Optional Hearts for favorite logic could go here */}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5">{theater.location}, {theater.city}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1.5 text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                M-Ticket
                                            </div>
                                            <div className="flex items-center gap-1.5 text-orange-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                                Food & Beverage
                                            </div>
                                        </div>
                                    </div>

                                    {/* Showtime Buttons Grid */}
                                    <div className="flex flex-wrap gap-3">
                                        {shows.map(show => (
                                            <button
                                                key={show.id}
                                                onClick={() => handleShowSelect(show)}
                                                className="group relative flex flex-col items-center justify-center w-24 h-12 sm:w-28 sm:h-14 
                                                   border border-slate-700 rounded-lg bg-slate-950/80 transition-all duration-200
                                                   hover:border-blue-500 hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]
                                                   active:bg-blue-600 active:text-white"
                                            >
                                                <span className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 group-active:text-white">
                                                    {formatTime(show.start_time)}
                                                </span>
                                                <span className="text-[10px] text-slate-500 group-hover:text-slate-400 group-active:text-blue-200">
                                                    ₹{show.price}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function ShowtimesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading Showtimes...</div>}>
            <ShowtimesContent />
        </Suspense>
    )
}
