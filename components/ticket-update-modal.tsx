'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface Booking {
  id: string;
  movieTitle: string;
  oldDate: Date;
  oldTime: string;
  cinema: string;
  seats: string[];
  totalPrice: number;
}

interface TicketUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
}

export function TicketUpdateModal({ open, onOpenChange, booking }: TicketUpdateModalProps) {
  const [step, setStep] = useState<'select-date' | 'select-time' | 'select-seats' | 'confirm'>('select-date');
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [newTime, setNewTime] = useState<string>('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(booking.seats);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  // Available times
  const availableTimes = ['10:00 AM', '1:00 PM', '4:30 PM', '7:00 PM', '10:00 PM'];

  const handleDateSelect = (date: Date) => {
    setNewDate(date);
    setStep('select-time');
  };

  const handleTimeSelect = (time: string) => {
    setNewTime(time);
    setStep('select-seats');
  };

  const handleUpdateBooking = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('[v0] Booking updated:', {
        bookingId: booking.id,
        newDate: format(newDate!, 'yyyy-MM-dd'),
        newTime,
        seats: selectedSeats,
      });
      
      // Show success and close
      alert('Booking updated successfully!');
      onOpenChange(false);
      setStep('select-date');
    } catch (error) {
      console.error('[v0] Update error:', error);
      alert('Failed to update booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Your Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">{booking.movieTitle}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Current Date</p>
                <p className="font-semibold text-foreground">{format(booking.oldDate, 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Time</p>
                <p className="font-semibold text-foreground">{booking.oldTime}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Cinema</p>
                <p className="font-semibold text-foreground">{booking.cinema}</p>
              </div>
            </div>
          </div>

          {/* Step: Select Date */}
          {step === 'select-date' && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4" />
                Select New Date
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date)}
                    className={`p-3 rounded-lg border transition ${
                      newDate?.toDateString() === date.toDateString()
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-border hover:border-accent'
                    }`}
                  >
                    <div className="text-sm font-semibold">{format(date, 'MMM dd')}</div>
                    <div className="text-xs text-muted-foreground">{format(date, 'EEE')}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Select Time */}
          {step === 'select-time' && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="w-4 h-4" />
                Select New Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-3 rounded-lg border transition ${
                      newTime === time ? 'border-accent bg-accent text-accent-foreground' : 'border-border hover:border-accent'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Select Seats */}
          {step === 'select-seats' && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-semibold">
                Seat Selection
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">Current Seats: {booking.seats.join(', ')}</p>
                <p className="text-sm text-foreground font-semibold">You can keep the same seats or select new ones during checkout.</p>
              </div>
              <Button onClick={() => setStep('confirm')} className="w-full bg-accent hover:bg-accent/90">
                Continue to Confirm
              </Button>
            </div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-foreground">Updated Booking Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">New Date</p>
                    <p className="font-semibold text-accent">{newDate && format(newDate, 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">New Time</p>
                    <p className="font-semibold text-accent">{newTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  A cancellation fee may apply if updating within 3 hours of the show.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {step !== 'select-date' && (
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 'select-time') setStep('select-date');
                  else if (step === 'select-seats') setStep('select-time');
                  else setStep('select-seats');
                }}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={step === 'confirm' ? handleUpdateBooking : () => {}}
              disabled={
                isSubmitting ||
                (step === 'select-date' && !newDate) ||
                (step === 'select-time' && !newTime)
              }
              className={`flex-1 ${step === 'confirm' ? 'bg-accent hover:bg-accent/90' : ''}`}
            >
              {isSubmitting ? 'Updating...' : step === 'confirm' ? 'Confirm Update' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
