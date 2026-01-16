'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { moviesApi, showsApi, bookingsApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';

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

// Mock categories for UI demo
const SEAT_TIERS = [
    { name: 'ROYAL RECLINER', price: 620, rows: ['A', 'B'] },
    { name: 'ROYAL', price: 400, rows: ['C', 'D', 'E', 'F'] },
    { name: 'CLUB', price: 380, rows: ['G', 'H', 'I', 'J'] }
];

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

    const toggleSeat = (seat: string, price: number) => {
        setSelectedSeats(prev =>
            prev.includes(seat)
                ? prev.filter(s => s !== seat)
                : [...prev, seat]
        );
    };

    const calculateTotal = () => {
        // Since price varies by tier, we need to sum based on selected seats
        // For simple logic, we can re-derive price from tier map or store price with seat
        // But the user requested simple logic. Let's assume the show.price is base and modifiers apply?
        // Or just strictly follow the tiers defined above.
        // Let's iterate selected seats and find their price.
        let total = 0;
        selectedSeats.forEach(seat => {
            const row = seat.charAt(0);
            const tier = SEAT_TIERS.find(t => t.rows.includes(row));
            if (tier) total += tier.price;
        });
        return total;
    };

    const handleBooking = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!show || selectedSeats.length === 0) {
            setError('Please select at least one seat');
            return;
        }

        const totalPrice = calculateTotal();
        const seatsParam = selectedSeats.join(',');

        router.push(`/booking/payment?show_id=${show.id}&movie_id=${movieId}&seats=${seatsParam}&price=${totalPrice}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white">
                <div className="p-8 text-center bg-slate-900/50 backdrop-blur rounded-2xl border border-slate-800">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-green-400 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-400">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    if (!show || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white">
                <div className="text-red-500">{error || 'Something went wrong'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#0f172a] to-[#1e293b] text-slate-100 flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-10 bg-[#020817]/80">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-100">{movie.title}</h1>
                            <p className="text-xs text-slate-400">
                                {show.theaters.name} • {format(new Date(show.start_time), 'h:mm a')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seat Map */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40">
                <div className="max-w-3xl mx-auto space-y-8">

                    {SEAT_TIERS.map((tier) => (
                        <div key={tier.name} className="space-y-4">
                            <div className="text-sm font-medium text-slate-500 text-center uppercase tracking-widest border-b border-slate-800/50 pb-2 mb-6">
                                {tier.name} — ₹{tier.price}
                            </div>

                            <div className="flex flex-col gap-4 items-center">
                                {tier.rows.map(row => (
                                    <div key={row} className="flex items-center gap-6">
                                        <div className="w-6 text-xs font-semibold text-slate-600 text-center">{row}</div>
                                        <div className="flex gap-2 sm:gap-3">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                                                const seatId = `${row}${num}`;
                                                const isSelected = selectedSeats.includes(seatId);
                                                // Randomly disable some seats for "Booked" effect simulation
                                                const isBooked = (row === 'D' && num === 5) || (row === 'F' && num === 2);

                                                return (
                                                    <button
                                                        key={seatId}
                                                        disabled={isBooked}
                                                        onClick={() => toggleSeat(seatId, tier.price)}
                                                        className={`
                                                            w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs font-medium transition-all duration-200
                                                            flex items-center justify-center border
                                                            ${isBooked
                                                                ? 'border-slate-800 bg-slate-900/50 text-slate-700 cursor-not-allowed'
                                                                : isSelected
                                                                    ? 'bg-blue-500/20 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                                                                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-blue-500/50 hover:text-blue-200 hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                                                            }
                                                        `}
                                                    >
                                                        {num}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Screen Indicator */}
                    <div className="pt-12 pb-8 flex flex-col items-center">
                        <div className="w-full max-w-lg h-16 border-t-4 border-blue-500/20 rounded-[50%] bg-gradient-to-b from-blue-500/5 to-transparent blur-sm mb-4"></div>
                        <p className="text-xs text-slate-500 tracking-[0.2em] font-medium text-center -mt-8">SCREEN THIS WAY</p>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 text-xs text-slate-400 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border border-slate-700"></div>
                            Available
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border border-blue-400 bg-blue-500/20"></div>
                            Selected
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border border-slate-800 bg-slate-900/50"></div>
                            Sold
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Summary */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 z-20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        {selectedSeats.length > 0 ? (
                            <>
                                <p className="text-xl font-bold text-white">₹{calculateTotal()}</p>
                                <p className="text-xs text-slate-400 mt-1">{selectedSeats.length} Seats: {selectedSeats.join(', ')}</p>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500">No seats selected</p>
                        )}
                    </div>

                    <Button
                        onClick={handleBooking}
                        disabled={selectedSeats.length === 0 || booking}
                        className={`
                            px-8 h-12 rounded-xl font-semibold shadow-lg transition-all
                            ${selectedSeats.length > 0
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        {booking ? 'Processing...' : 'Proceed to Pay'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function SeatSelectionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">Loading...</div>}>
            <SeatSelectionContent />
        </Suspense>
    );
}
