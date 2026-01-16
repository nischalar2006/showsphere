"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { moviesApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Film } from "lucide-react"

interface Movie {
    id: string
    title: string
}

function BookingPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const movieId = searchParams.get("movie_id")

    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Fetch movie details
    useEffect(() => {
        const fetchMovie = async () => {
            if (!movieId) return
            try {
                const data = await moviesApi.getById(movieId)
                setMovie(data)
            } catch (error) {
                console.error("Failed to fetch movie:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchMovie()
    }, [movieId])

    // Calendar Logic
    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const startDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const handlePrevMonth = () => {
        const newDate = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
        const today = new Date()
        if (newDate.getMonth() < today.getMonth() && newDate.getFullYear() <= today.getFullYear()) {
            setCurrentMonth(new Date())
            return
        }
        setCurrentMonth(new Date(newDate))
    }

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
    }

    const isDateDisabled = (day: number) => {
        const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return dateToCheck < today
    }

    const handleDateSelect = (day: number) => {
        if (isDateDisabled(day)) return
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        setSelectedDate(newDate)
    }

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentMonth)
        const startDay = startDayOfMonth(currentMonth)
        const days = []

        // Empty cells for previous month days
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 sm:h-12" />)
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const isSelected = selectedDate?.toDateString() === dateToCheck.toDateString()
            const isToday = new Date().toDateString() === dateToCheck.toDateString()
            const disabled = isDateDisabled(day)

            days.push(
                <button
                    key={day}
                    disabled={disabled}
                    onClick={() => handleDateSelect(day)}
                    className={`
            h-10 sm:h-12 rounded-lg text-sm sm:text-base font-medium transition-all duration-200
            flex items-center justify-center relative
            ${disabled ? "text-slate-600 cursor-not-allowed" : "hover:bg-slate-800 text-slate-100 cursor-pointer hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]"}
            ${isSelected ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] border-blue-400" : "bg-slate-900/40"}
            ${isToday && !isSelected ? "border border-blue-500/50 text-blue-400" : "border border-transparent"}
          `}
                >
                    {day}
                </button>
            )
        }
        return days
    }

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#0f172a] to-[#1e293b] text-slate-100 pb-20 selection:bg-blue-500/30">

            {/* Header Container */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
                <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 mb-8 drop-shadow-sm">
                    Book Tickets
                </h1>

                <div className="space-y-8">

                    {/* Movie Selection Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Film className="w-4 h-4 text-blue-400" />
                            Selected Movie
                        </label>
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-black/10">
                            {/* We could add poster here if we had it easily available/cached, but keeping it simple as requested */}
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-slate-100 tracking-wide">
                                    {movie ? movie.title : "Movie Name Unavailable"}
                                </h2>
                                {movie && <p className="text-sm text-slate-500 mt-1">Make a selection below to proceed</p>}
                            </div>
                        </div>
                    </div>

                    {/* Date Selection Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            Select Date
                        </label>

                        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 rounded-2xl p-4 sm:p-6 shadow-xl shadow-black/20">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-semibold text-slate-100">
                                    {months[currentMonth.getMonth()]} <span className="text-slate-500">{currentMonth.getFullYear()}</span>
                                </h3>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {weekDays.map(day => (
                                    <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2 sm:gap-3">
                                {renderCalendarDays()}
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/50 flex justify-center z-40 sm:static sm:bg-transparent sm:border-0 sm:p-0 sm:block sm:mt-8">
                        <Button
                            disabled={!selectedDate}
                            className={`w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold rounded-xl transition-all duration-300 shadow-lg
                 ${selectedDate
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25"
                                    : "bg-slate-800 text-slate-500 cursor-not-allowed"}
               `}
                            onClick={() => {
                                if (!selectedDate) return
                                router.push(`/booking/showtimes?movie_id=${movieId}&date=${selectedDate.toISOString()}`)
                            }}
                        >
                            {selectedDate ? `Continue to Showtimes` : "Select a Date to Continue"}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>}>
            <BookingPageContent />
        </Suspense>
    )
}
