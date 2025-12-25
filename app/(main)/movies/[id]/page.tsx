"use client"

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Share2, ThumbsUp, Loader2, User } from 'lucide-react'
import { TrailerModal } from '@/components/trailer-modal'
import { useState, useEffect } from 'react'
import { Footer } from '@/components/footer'
import { moviesApi } from '@/lib/api'
import { useAuth } from '@/context/auth-context'

// Cast Data Store
const castDatabase: Record<string, { name: string; role: string; image: string }[]> = {
    "1": [ // Kalki
        { name: "Prabhas", role: "Bhairava", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/prabhas-1708-1686915417.jpg" },
        { name: "Deepika Padukone", role: "Sum-80", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/deepika-padukone-2822-12-09-2017-06-31-43.jpg" },
        { name: "Amitabh Bachchan", role: "Ashwatthama", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/amitabh-bachchan-138-12-09-2017-02-17-38.jpg" },
        { name: "Kamal Haasan", role: "Supreme Yaskin", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/kamal-haasan-2886-24-03-2017-17-54-38.jpg" },
        { name: "Disha Patani", role: "Roxie", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/disha-patani-1061408-1714379022.jpg" }
    ],
    "2": [ // Oppenheimer
        { name: "Cillian Murphy", role: "J. Robert Oppenheimer", image: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg" },
        { name: "Emily Blunt", role: "Katherine Oppenheimer", image: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Emily_Blunt_SAG_Awards_2019.png" },
        { name: "Matt Damon", role: "Leslie Groves", image: "https://upload.wikimedia.org/wikipedia/commons/8/82/Damon_Matt_2009_Venice_Film_Festival.jpg" },
        { name: "Robert Downey Jr.", role: "Lewis Strauss", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/800px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg" }
    ],
    "3": [ // Jawan
        { name: "Shah Rukh Khan", role: "Vikram Rathore / Azad", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/shah-rukh-khan-2092-12-09-2017-02-10-43.jpg" },
        { name: "Nayanthara", role: "Narmada Rai", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/nayanthara-5254-19-09-2017-04-12-32.jpg" },
        { name: "Vijay Sethupathi", role: "Kaalie Gaikwad", image: "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/vijay-sethupathi-32355-16-09-2017-05-37-37.jpg" }
    ]
}

// Fallback Mock Data for Demo items
const movieDatabase: any = {
    "1": {
        id: "1",
        title: "Kalki 2898 AD",
        backgroundImage: "https://assets-in.bmscdn.com/promotions/cms/creatives/1717054668508_kalki2898adweb.jpg",
        posterImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00352941-1718275859.jpg",
        rating: "8.8/10",
        voteCount: "675.3K Votes",
        interestCount: "1.4M+ are interested",
        duration: "3h 1m",
        genre: ["Action", "Sci-Fi", "Thriller"],
        certification: "UA",
        releaseDate: "27 Jun, 2024",
        language: ["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"],
        formats: ["2D", "3D", "IMAX 3D"],
        description: "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.",
        trailerId: "kQz-7l35F1I"
    },
    // ... (Other mock data can be simplified or kept if needed, assuming user wants it available as fallback)
    // For brevity I'll keep the structure but relying on API mostly.
}

export default function MovieDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const id = params.id as string
    const [isTrailerOpen, setIsTrailerOpen] = useState(false)
    const [movie, setMovie] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Determine cast: Use specific cast if available, else null (or generic placeholder later)
    const specificCast = castDatabase[id]

    const handleInterest = async () => {
        if (!user) {
            router.push('/login')
            return
        }
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
            const res = await fetch(`${baseUrl}/movies/${id}/interest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user.id })
            })

            if (res.ok) {
                alert("Interest registered!")
                window.location.reload()
            } else {
                const err = await res.json()
                // If already interested, just alert that
                if (err.message === "Already interested") {
                    alert("You are already interested in this movie!")
                } else {
                    alert(err.message || "Failed to register interest")
                }
            }
        } catch (error) {
            console.error("Interest error", error)
        }
    }

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                if (movieDatabase[id]) {
                    setMovie(movieDatabase[id])
                    setLoading(false)
                    return
                }

                const data = await moviesApi.getById(id)

                const getYouTubeId = (url: string) => {
                    if (!url) return ""
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
                    const match = url.match(regExp)
                    return (match && match[2].length === 11) ? match[2] : ""
                }

                setMovie({
                    id: data.id,
                    title: data.title,
                    backgroundImage: data.backdrop_url || data.poster_url,
                    posterImage: data.poster_url,
                    rating: (data.rating || 0) + "/10",
                    voteCount: "1K+ Votes",
                    interestCount: `${data.interest_count || 0} interested`,
                    duration: (data.duration ? `${Math.floor(data.duration / 60)}h ${data.duration % 60}m` : "N/A"),
                    genre: Array.isArray(data.genre) ? data.genre : [data.genre || "Drama"],
                    certification: "UA",
                    releaseDate: data.release_date ? new Date(data.release_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Coming Soon",
                    language: [data.language || "English"],
                    formats: ["2D"],
                    description: data.description || "No description available.",
                    trailerId: getYouTubeId(data.trailer_url),
                    trailer_url: data.trailer_url
                })
            } catch (error) {
                console.error("Failed to fetch movie", error)
                // Fallback for demo
                if (id === '0' || !id) {
                    setMovie({
                        id: "0",
                        title: "Avatar: Fire and Ash",
                        backgroundImage: "https://assets-in.bmscdn.com/promotions/cms/creatives/1693561351496_motogp_desktop.jpg",
                        posterImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/avatar-the-way-of-water-et00037264-1670850720.jpg",
                        rating: "8/10",
                        interestCount: "1.4M+ are interested",
                        duration: "3h 17m",
                        genre: ["Action", "Adventure"],
                        certification: "UA16+",
                        releaseDate: "19 Dec, 2025",
                        language: ["English"],
                        formats: ["2D", "3D"],
                        description: "The biggest film in the world...",
                        trailerId: "",
                        trailer_url: ""
                    })
                }
            } finally {
                setLoading(false)
            }
        }

        fetchMovie()
    }, [id])


    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        )
    }

    if (!movie) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-white">Movie not found</div>
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section / Backdrop */}
            <div
                className="relative w-full h-[480px] md:h-[550px]"
                style={{
                    backgroundImage: `linear-gradient(90deg, #1A1A1A 24.97%, #1A1A1A 38.3%, rgba(26, 26, 26, 0.0409746) 97.47%, #1A1A1A 100%), url('${movie.backgroundImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center right',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="flex flex-col md:flex-row gap-8 items-start w-full mt-8 md:mt-0">
                        {/* Poster Image */}
                        <div className="relative shrink-0 w-[260px] md:w-[280px] rounded-lg overflow-hidden shadow-2xl z-10">
                            <img src={movie.posterImage} alt={movie.title} className="w-full h-auto object-cover" />
                            {movie.trailerId && (
                                <div
                                    className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm py-2 text-center cursor-pointer hover:bg-black/80 transition-colors flex items-center justify-center gap-2 text-white font-medium text-sm"
                                    onClick={() => setIsTrailerOpen(true)}
                                >
                                    <Play className="w-4 h-4 fill-white" /> Trailers
                                </div>
                            )}
                        </div>

                        {/* Movie Details */}
                        <div className="flex-1 text-white z-10 pt-4">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>

                            {/* Interest / Rating Block */}
                            <div className="flex items-center gap-4 mb-6 bg-secondary/20 p-4 rounded-xl backdrop-blur-sm border border-white/10 max-w-xl">
                                <div className="flex items-center gap-3">
                                    <ThumbsUp className="w-6 h-6 text-green-500 fill-green-500" />
                                    <div>
                                        <div className="font-bold text-lg leading-tight">{movie.interestCount}</div>
                                        <div className="text-xs text-gray-300">Are you interested in watching this movie?</div>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="ml-auto bg-white text-black hover:bg-gray-200"
                                    onClick={handleInterest}
                                >
                                    I&apos;m interested
                                </Button>
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <Badge variant="outline" className="text-foreground bg-white/20 border-0 hover:bg-white/30 text-xs px-2 py-0.5">{movie.formats.join(", ")}</Badge>
                                <Badge variant="outline" className="text-foreground bg-white/20 border-0 hover:bg-white/30 text-xs px-2 py-0.5">{movie.language.join(", ")}</Badge>
                            </div>

                            <div className="text-base font-medium mb-8 text-gray-200">
                                {movie.duration} • {movie.genre.join(", ")} • {movie.certification} • {movie.releaseDate}
                            </div>

                            {/* CTA Buttons - Trailer button removed as per request */}
                            <div className="flex items-center gap-4">
                                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-red-600/50"
                                    onClick={() => router.push(`/booking?movie_id=${movie.id}`)}>
                                    Book tickets
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">About the movie</h2>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-4xl">
                    {movie.description}
                </p>

                <div className="my-8 border-t border-border"></div>

                <h2 className="text-2xl font-bold text-foreground mb-4">Cast</h2>
                {specificCast ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {specificCast.map((actor, index) => (
                            <div key={index} className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2 shadow-md hover:scale-105 transition-transform">
                                    <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm">{actor.name}</h3>
                                <p className="text-xs text-muted-foreground">as {actor.role}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 opacity-70">
                        {/* Generic Placeholder for unknown movies */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-secondary/30 flex items-center justify-center mb-2">
                                    <User className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm">Artist {i}</h3>
                                <p className="text-xs text-muted-foreground">Cast Member</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                movieTitle={movie.title}
                youtubeVideoId={movie.trailerId}
            />

            <Footer />
        </div>
    )
}
