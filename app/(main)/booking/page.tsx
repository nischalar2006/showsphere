'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { moviesApi, showsApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Movie {
    id: string;
    title: string;
    poster_url: string;
    duration: number;
}

interface Theater {
    id: string;
    name: string;
    city: string;
    location: string;
}

interface Show {
    id: string;
    start_time: string;
    price: number;
    movies: Movie;
    theaters: Theater;
}

function BookingContent() {
    const searchParams = useSearchParams();
    const movieId = searchParams.get('movie_id');
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (movieId) {
            fetchMovieAndShows();
        }
    }, [movieId]);

    const fetchMovieAndShows = async () => {
        try {
            const [movieData, showsData] = await Promise.all([
                moviesApi.getById(movieId!),
                showsApi.getAll({ movie_id: movieId! })
            ]);
            setMovie(movieData);
            setShows(showsData);
        } catch (err: any) {
            setError(err.message || 'Failed to load booking data');
        } finally {
            setLoading(false);
        }
    };

    const handleShowSelect = (show: Show) => {
        router.push(`/booking/seats?show_id=${show.id}&movie_id=${movieId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-[#E5E7EB]">Book Tickets</h1>

                {movie && (
                    <Card className="mb-6 bg-[#111827] border-[#374151]">
                        <CardHeader>
                            <CardTitle className="text-[#E5E7EB]">{movie.title}</CardTitle>
                        </CardHeader>
                    </Card>
                )}

                {/* Show Selection */}
                <Card className="mb-6 bg-[#111827] border-[#374151]">
                    <CardHeader>
                        <CardTitle className="text-[#E5E7EB]">Select Show</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shows.map((show) => (
                                <Button
                                    key={show.id}
                                    variant="outline"
                                    className="h-auto p-4 flex flex-col items-start bg-[#1F2937] border-[#374151] text-[#E5E7EB] hover:bg-[#2563EB] hover:text-white transition-colors"
                                    onClick={() => handleShowSelect(show)}
                                >
                                    <div className="font-bold">{show.theaters.name}</div>
                                    <div className="text-sm text-[#9CA3AF]">{show.theaters.city}</div>
                                    <div className="text-sm mt-2 text-[#E5E7EB]">
                                        {format(new Date(show.start_time), 'MMM dd, h:mm a')}
                                    </div>
                                    <div className="text-sm font-semibold mt-1 text-[#FACC15]">₹{show.price}</div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading Booking...</div>}>
            <BookingContent />
        </Suspense>
    );
}
