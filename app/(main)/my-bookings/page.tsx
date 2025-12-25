'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { bookingsApi } from '@/lib/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Footer } from '@/components/footer';

interface Booking {
    id: string;
    created_at: string;
    total_price: number;
    status: string;
    show_id: string;
    user_id: string;
    show: {
        id: string;
        movie_id: string;
        theater_id: string;
        start_time: string;
        end_time: string;
        language: string;
        movie: {
            id: string;
            title: string;
            image: string;
            duration: number;
        };
        theater: {
            id: string;
            name: string;
            location: string;
        };
    };
    seat_numbers: string[];
}

export default function MyBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/my-bookings');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchBookings() {
            if (!user) return;

            try {
                setLoading(true);
                // The API returns an array of bookings
                const data = await bookingsApi.getUserBookings();
                setBookings(data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Failed to load your bookings. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (authLoading || (loading && !error)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">My Bookings</h1>

                {error ? (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-xl border border-border">
                        <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
                        <p className="text-muted-foreground mb-6">You haven't booked any movie tickets yet.</p>
                        <Button
                            onClick={() => router.push('/movies')}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                        >
                            Browse Movies
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => {
                            if (!booking.show) return null;
                            const showDate = new Date(booking.show.start_time);
                            const formattedDate = format(showDate, 'EEE, dd MMM yyyy');
                            const formattedTime = format(showDate, 'hh:mm a');

                            // Sort seats to display them nicely
                            const seatNumbers = [...booking.seat_numbers]
                                .sort((a, b) => {
                                    const rowA = a.match(/[A-Z]+/)?.[0] || '';
                                    const rowB = b.match(/[A-Z]+/)?.[0] || '';
                                    if (rowA !== rowB) return rowA.localeCompare(rowB);
                                    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                                    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                                    return numA - numB;
                                })
                                .join(', ');

                            return (
                                <div
                                    key={booking.id}
                                    className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
                                >
                                    {/* Movie Image */}
                                    <div className="relative w-full md:w-48 h-48 md:h-auto bg-muted flex-shrink-0">
                                        {booking.show.movie.image ? (
                                            <Image
                                                src={booking.show.movie.image}
                                                alt={booking.show.movie.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Ticket className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-grow p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-xl font-bold text-foreground">{booking.show.movie.title}</h2>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-muted-foreground mt-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-accent" />
                                                    <span className="font-medium text-foreground">{booking.show.theater.name}</span>
                                                    <span>- {booking.show.theater.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-accent" />
                                                    <span className="font-medium text-foreground">{formattedDate}</span>
                                                    <span>| {formattedTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:col-span-2 mt-2">
                                                    <Ticket className="w-4 h-4 text-accent" />
                                                    <span>Seats:</span>
                                                    <span className="font-medium text-foreground">{seatNumbers}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Booking ID</span>
                                                <span className="font-mono font-medium text-foreground">{booking.id.substring(0, 8).toUpperCase()}...</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-muted-foreground">Total Amount</span>
                                                <span className="text-lg font-bold text-accent">₹{booking.total_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
