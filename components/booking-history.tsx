'use client';

import { useState } from 'react';
import { Edit2, Calendar, MapPin, TicketX as Tickets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketUpdateModal } from '@/components/ticket-update-modal';
import { format } from 'date-fns';

interface BookingHistoryProps {
  isOpen: boolean;
}

export function BookingHistory({ isOpen }: BookingHistoryProps) {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Simulated booking history
  const bookings = [
    {
      id: 'BK001',
      movieTitle: 'Predator: Badlands',
      oldDate: new Date(2025, 0, 25),
      oldTime: '7:00 PM',
      cinema: 'INOX Garudha Mall',
      seats: ['A1', 'A2'],
      totalPrice: 1240,
      status: 'confirmed',
      bookingDate: new Date(2025, 0, 20),
    },
    {
      id: 'BK002',
      movieTitle: 'Kantara Chapter-1',
      oldDate: new Date(2025, 1, 15),
      oldTime: '4:30 PM',
      cinema: 'Cinepolis Binnypet',
      seats: ['C5', 'C6', 'C7'],
      totalPrice: 1200,
      status: 'confirmed',
      bookingDate: new Date(2025, 1, 10),
    },
    {
      id: 'BK003',
      movieTitle: 'SatyaPrem Ki Katha',
      oldDate: new Date(2024, 11, 20),
      oldTime: '10:00 PM',
      cinema: 'Lulu Mall',
      seats: ['D3'],
      totalPrice: 380,
      status: 'completed',
      bookingDate: new Date(2024, 11, 15),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Tickets className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No bookings yet. Start booking now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Left Side */}
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{booking.movieTitle}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(booking.oldDate, 'MMM dd, yyyy')} • {booking.oldTime}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {booking.cinema}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tickets className="w-4 h-4" />
                      Seats: {booking.seats.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Booking ID: {booking.id}</p>
                    <div className="inline-block">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Total Price</p>
                    <p className="text-xl font-bold text-accent">₹{booking.totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {booking.status === 'confirmed' && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setUpdateModalOpen(true);
                    }}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Update Ticket
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      {selectedBooking && (
        <TicketUpdateModal
          open={updateModalOpen}
          onOpenChange={setUpdateModalOpen}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}
