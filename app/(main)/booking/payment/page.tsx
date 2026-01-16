'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { bookingsApi, moviesApi, showsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Wallet, Banknote, ChevronLeft, ShieldCheck, Check, Building2, Landmark } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

function PaymentPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Params from URL
    const showId = searchParams.get('show_id');
    const movieId = searchParams.get('movie_id');
    const seatsParam = searchParams.get('seats');
    const priceParam = searchParams.get('price');

    const [loading, setLoading] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null); // To store details for modal
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

    // Form States
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedUpi, setSelectedUpi] = useState('');

    const POPULAR_UPI_APPS = [
        { id: 'gpay', name: 'Google Pay' },
        { id: 'phonepe', name: 'PhonePe' },
        { id: 'paytm', name: 'Paytm' },
        { id: 'bhim', name: 'BHIM UPI' },
    ];

    // State for full objects needed for LocalStorage
    const [fullMovie, setFullMovie] = useState<any>(null);
    const [fullShow, setFullShow] = useState<any>(null);

    const [theaterName, setTheaterName] = useState('ShowSphere Cinema');
    const [showTime, setShowTime] = useState('');
    const [movieTitle, setMovieTitle] = useState('');

    useEffect(() => {
        const fetchContext = async () => {
            if (showId && movieId) {
                try {
                    const [movie, shows] = await Promise.all([
                        moviesApi.getById(movieId),
                        showsApi.getAll({ movie_id: movieId })
                    ]);
                    setFullMovie(movie);
                    setMovieTitle(movie.title);

                    const show = shows.find((s: any) => s.id === showId);
                    if (show) {
                        setFullShow(show);
                        setTheaterName(show.theaters.name);
                        setShowTime(show.start_time);
                    }
                } catch (e) {
                    console.error("Background fetch failed", e);
                }
            }
        };
        fetchContext();
    }, [showId, movieId]);


    const handlePayment = async () => {
        if (!showId || !seatsParam || !priceParam) {
            setError('Invalid booking details');
            return;
        }

        if (paymentMethod === 'netbanking' && !selectedBank) {
            setError('Please select a bank');
            return;
        }

        if (paymentMethod === 'upi' && !selectedUpi) {
            setError('Please select a UPI app');
            return;
        }

        setLoading(true);
        setError('');

        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Attempt to create booking
            await bookingsApi.create({
                show_id: showId,
                seat_numbers: seatsParam.split(','),
                total_price: Number(priceParam)
            });
        } catch (err: any) {
            console.warn("Booking API failed (likely guest mode), saving to LocalStorage:", err);

            // Fallback: Save to LocalStorage for Guest/Demo
            if (fullMovie && fullShow) {
                const guestBooking = {
                    id: `guest-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    total_price: Number(priceParam),
                    status: 'confirmed',
                    show_id: showId,
                    user_id: 'guest',
                    seat_numbers: seatsParam.split(','),
                    show: {
                        id: showId,
                        movie_id: movieId,
                        theater_id: fullShow.theater_id,
                        start_time: fullShow.start_time,
                        end_time: fullShow.end_time || new Date(new Date(fullShow.start_time).getTime() + fullMovie.duration * 60000).toISOString(),
                        language: fullShow.language || 'Hindi',
                        movie: {
                            id: fullMovie.id,
                            title: fullMovie.title,
                            image: fullMovie.image,
                            duration: fullMovie.duration
                        },
                        theater: {
                            id: fullShow.theaters.id,
                            name: fullShow.theaters.name,
                            location: fullShow.theaters.location
                        }
                    }
                };

                const existing = JSON.parse(localStorage.getItem('guest_bookings') || '[]');
                localStorage.setItem('guest_bookings', JSON.stringify([guestBooking, ...existing]));
            }
        } finally {
            setLoading(false);
            setSuccessModalOpen(true);
        }
    };

    const POPULAR_BANKS = [
        { id: 'sbi', name: 'SBI' },
        { id: 'hdfc', name: 'HDFC' },
        { id: 'icici', name: 'ICICI' },
        { id: 'bob', name: 'Bank of Baroda' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#0f172a] to-[#1e293b] text-slate-100 flex flex-col items-center py-10 px-4">

            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors border border-slate-700 hover:border-slate-600"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Payment</h1>
                </div>

                {/* Amount Summary Card */}
                <div className="bg-gradient-to-r from-blue-900/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-6 mb-8 flex justify-between items-center shadow-lg">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-white">₹{priceParam}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Seats</p>
                        <p className="text-sm font-medium text-blue-200">{seatsParam?.replace(/,/g, ', ')}</p>
                    </div>
                </div>

                {/* Secure Payment Badge */}
                <div className="flex items-center gap-2 text-xs text-green-400 mb-6 bg-green-900/10 w-fit px-3 py-1.5 rounded-full border border-green-900/30">
                    <ShieldCheck className="w-3 h-3" />
                    Secure SSL Payment
                </div>

                {/* Payment Methods */}
                <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className={`
                            flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
                            ${paymentMethod === 'card'
                                ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]'
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                            }
                        `}
                    >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-xs font-medium">Card</span>
                    </button>
                    <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`
                            flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
                            ${paymentMethod === 'upi'
                                ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]'
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                            }
                        `}
                    >
                        <Wallet className="w-6 h-6" />
                        <span className="text-xs font-medium">UPI</span>
                    </button>
                    <button
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`
                            flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
                            ${paymentMethod === 'netbanking'
                                ? 'bg-blue-600/20 border-blue-500 text-blue-100 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]'
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                            }
                        `}
                    >
                        <Landmark className="w-6 h-6" />
                        <span className="text-xs font-medium">Net Banking</span>
                    </button>
                </div>

                {/* Forms */}
                <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 mb-8 min-h-[300px]">
                    {paymentMethod === 'card' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber" className="text-slate-400 text-xs">Card Number</Label>
                                <Input
                                    id="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry" className="text-slate-400 text-xs">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM / YY"
                                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc" className="text-slate-400 text-xs">CVC</Label>
                                    <Input
                                        id="cvc"
                                        placeholder="123"
                                        type="password"
                                        maxLength={3}
                                        className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-400 text-xs">Cardholder Name</Label>
                                <Input
                                    id="name"
                                    placeholder="JOHN DOE"
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'netbanking' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <Label className="text-slate-400 text-xs mb-3 block">Popular Banks</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {POPULAR_BANKS.map(bank => (
                                        <button
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank.id)}
                                            className={`
                                                p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2
                                                ${selectedBank === bank.id
                                                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                                                    : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                                                }
                                            `}
                                        >
                                            <Building2 className="w-4 h-4" />
                                            {bank.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-slate-400 text-xs mb-2 block">Other Banks</Label>
                                <Select onValueChange={setSelectedBank} value={selectedBank}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                                        <SelectValue placeholder="Select Bank" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                                        <SelectItem value="axis">Axis Bank</SelectItem>
                                        <SelectItem value="kotak">Kotak Mahindra</SelectItem>
                                        <SelectItem value="canara">Canara Bank</SelectItem>
                                        <SelectItem value="union">Union Bank</SelectItem>
                                        <SelectItem value="pnb">Punjab National Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}


                    {paymentMethod === 'upi' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <Label className="text-slate-400 text-xs mb-3 block">Pay using UPI</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {POPULAR_UPI_APPS.map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => setSelectedUpi(app.id)}
                                            className={`
                                                p-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2
                                                ${selectedUpi === app.id
                                                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                                                    : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                                                }
                                            `}
                                        >
                                            {/* If we had logos, we'd use them here. For now, text/icon combo is clean. */}
                                            <Wallet className="w-4 h-4" />
                                            {app.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 text-xs text-slate-400 text-center">
                                You will be redirected to the selected UPI app to complete the payment.
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 text-center animate-in fade-in">
                        {error}
                    </div>
                )}

                {/* Pay Button */}
                <Button
                    onClick={handlePayment}
                    disabled={loading || (paymentMethod === 'netbanking' && !selectedBank)}
                    className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : (
                        `Pay ₹${priceParam}`
                    )}
                </Button>

                <p className="text-center text-xs text-slate-500 mt-4">
                    By clicking "Pay", you agree to the Terms & Conditions
                </p>

            </div>

            {/* Success Modal */}
            <Dialog open={successModalOpen} onOpenChange={() => { }}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                            <Check className="w-8 h-8 text-green-500" />
                        </div>

                        <DialogTitle className="text-2xl font-bold text-white mb-2">Booking Confirmed 🎉</DialogTitle>
                        <p className="text-slate-400 text-sm mb-6">Your tickets have been successfully booked.</p>

                        <div className="w-full bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Movie</span>
                                <span className="font-medium text-slate-200">{movieTitle || 'Loading...'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Theater</span>
                                <span className="font-medium text-slate-200 text-right">{theaterName}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Date & Time</span>
                                <span className="font-medium text-slate-200">
                                    {showTime ? format(new Date(showTime), 'MMM dd, h:mm a') : 'Loading...'}
                                </span>
                            </div>
                            <div className="border-t border-slate-800 my-2"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Seats</span>
                                <span className="font-medium text-blue-400">{seatsParam?.replace(/,/g, ', ')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Total Amount</span>
                                <span className="font-bold text-green-400">₹{priceParam}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => router.push('/profile')}>
                                View Booking
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" onClick={() => router.push('/')}>
                                Go to Home
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">Loading...</div>}>
            <PaymentPageContent />
        </Suspense>
    );
}
