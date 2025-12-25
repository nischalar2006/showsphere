'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { moviesApi, showsApi, bookingsApi } from '@/lib/api';
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

function SeatSelectionContent() {
    const searchParams = useSearchParams();
    const showId = searchParams.get('show_id');
    const movieId = searchParams.get('movie_id');
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [show, setShow] = useState<Show | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (showId && movieId) {
            fetchData();
        } else {
            setError('Missing show or movie information');
            setLoading(false);
        }
    }, [showId, movieId]);

    const fetchData = async () => {
        try {
            // In a real app we might want a specific generic getById for shows, 
            // but here we can reuse the movie fetch and list shows to find the specific one
            // or if the API supports it, get show by ID.
            // Assuming showsApi.getAll returns all shows for a movie, we can find the one we need.

            const [movieData, showsData] = await Promise.all([
                moviesApi.getById(movieId!),
                showsApi.getAll({ movie_id: movieId! })
            ]);

            setMovie(movieData);
            const foundShow = showsData.find((s: Show) => s.id === showId);
            if (foundShow) {
                setShow(foundShow);
            } else {
                setError('Show not found');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const generateSeats = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
        const seatsPerRow = 10;
        const seats = [];
        for (const row of rows) {
            for (let i = 1; i <= seatsPerRow; i++) {
                seats.push(`${row}${i}`);
            }
        }
        return seats;
    };

    const toggleSeat = (seat: string) => {
        setSelectedSeats(prev =>
            prev.includes(seat)
                ? prev.filter(s => s !== seat)
                : [...prev, seat]
        );
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!show || selectedSeats.length === 0) {
            setError('Please select at least one seat');
            return;
        }

        setBooking(true);
        setError('');

        try {
            await bookingsApi.create({
                show_id: show.id,
                seat_numbers: selectedSeats,
                total_price: show.price * selectedSeats.length
            });
            setSuccess(true);
            setTimeout(() => router.push('/'), 2000);
        } catch (err: any) {
            setError(err.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-600">Redirecting to home...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!show || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error || 'Something went wrong'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-[#E5E7EB]">Select Seats</h1>

                <Card className="mb-6 bg-[#111827] border-[#374151]">
                    <CardHeader>
                        <CardTitle className="text-[#E5E7EB]">{movie.title}</CardTitle>
                        <div className="text-[#9CA3AF]">
                            {show.theaters.name}, {show.theaters.city}
                            <br />
                            {format(new Date(show.start_time), 'MMM dd, h:mm a')}
                        </div>
                    </CardHeader>
                </Card>

                <Card className="mb-6 bg-[#111827] border-[#374151]">
                    <CardContent className="pt-6">
                        <div className="mb-8 text-center">
                            <div className="inline-block bg-[#1F2937] px-16 py-2 rounded-b-lg text-sm font-semibold tracking-widest text-[#9CA3AF] shadow-md border-t-0 border border-[#374151]">
                                SCREEN
                            </div>
                        </div>

                        {/* SeatSelector component handles its own colors, but we need to ensure the container here is compatible if we were using raw buttons. 
                            Wait, the code below manually implements seat buttons instead of using SeatSelector component?
                            Ah, I see lines 186-199 are manually mapping buttons.
                            Plan said "Ensure SeatSelector (already updated) looks good".
                            But this file implements its own grid!
                            I should update these buttons to match the logic I put in SeatSelector or use SeatSelector.
                            Since user said "Booking flow still works exactly the same", adhering to existing logic but fixing styles is safer than replacing with component.
                            I will apply the specific hex codes for seats here too.
                        */}
                        <div className="grid grid-cols-10 gap-3 max-w-2xl mx-auto mb-8">
                            {generateSeats().map((seat) => (
                                <Button
                                    key={seat}
                                    size="sm"
                                    variant={selectedSeats.includes(seat) ? 'default' : 'outline'}
                                    onClick={() => toggleSeat(seat)}
                                    className={`h-10 transition-all ${selectedSeats.includes(seat)
                                        ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-transparent'
                                        : 'bg-[#374151] hover:bg-[#4B5563] text-gray-200 border-transparent'
                                        }`}
                                >
                                    {seat}
                                </Button>
                            ))}
                        </div>

                        <div className="border-t border-[#374151] pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <div className="text-sm text-[#9CA3AF] mb-1">Selected Seats</div>
                                    <div className="font-semibold text-lg text-[#E5E7EB]">
                                        {selectedSeats.join(', ') || 'None'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-[#9CA3AF] mb-1">Total Amount</div>
                                    <div className="text-2xl font-bold text-[#FACC15]">
                                        ₹{show.price * selectedSeats.length}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-900/20 text-red-500 rounded-md border border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleBooking}
                                disabled={selectedSeats.length === 0 || booking}
                                size="lg"
                                className="w-full text-lg h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                            >
                                {booking ? 'Processing...' : 'Confirm Booking'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function SeatSelectionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SeatSelectionContent />
        </Suspense>
    );
}
