import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, isBefore, isAfter, parseISO, isWithinInterval, startOfDay } from 'date-fns';
import { clientRoomApi, BookingData } from '../api/clientRoomApi';
import { Booking, bookingApi } from '@/api/bookingApi';

interface BookingCalendarProps {
  roomId: string;
  onBookingComplete?: () => void;
}

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  roomId, 
  onBookingComplete 
}) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'dates' | 'info'>('dates');

  useEffect(() => {
    fetchBookings();
  }, [roomId]);

  const fetchBookings = async () => {
    try {
      const data = await bookingApi.getRoomBookings(roomId);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load availability');
    }
  };

  const isDateBooked = (date: Date) => {
    const day = startOfDay(date);
    return bookings.some(booking => {
      if (booking.status === 'cancelled') return false;
      
      const startDate = startOfDay(parseISO(booking.startDate));
      const endDate = startOfDay(parseISO(booking.endDate));
      
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
  };

  const isDateDisabled = (date: Date) => {
    // Can't book dates before today
    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }

    // Can't book already booked dates
    if (isDateBooked(date)) {
      return true;
    }

    // If selecting end date, can't select dates that would include booked dates
    if (selectedRange.from && !selectedRange.to) {
      const start = selectedRange.from;
      let current = start;
      while (isBefore(current, date)) {
        current = addDays(current, 1);
        if (isDateBooked(current)) {
          return true;
        }
      }
    }

    return false;
  };

  const handleDateSelect = (range: DateRange) => {
    if (range.from && range.to) {
      setError(null);
      setSelectedRange(range);
      setStep('info');
    } else {
      setSelectedRange(range);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestInfo({
      ...guestInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRange.from || !selectedRange.to) return;

    setLoading(true);
    setError(null);

    try {
      const bookingData: BookingData = {
        roomId,
        startDate: selectedRange.from,
        endDate: selectedRange.to,
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone
      };

      await clientRoomApi.createBooking(bookingData);
      
      if (onBookingComplete) {
        onBookingComplete();
      }
    } catch (err) {
      setError('Failed to create booking');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'dates' ? (
          <div className="space-y-4">
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              disabled={isDateDisabled}
              modifiers={{ booked: isDateBooked }}
              modifiersStyles={{
                booked: { 
                  textDecoration: 'line-through',
                  color: 'red'
                }
              }}
              className="rounded-md border"
            />

            {selectedRange.from && selectedRange.to && (
              <div className="text-sm text-gray-600">
                Selected dates: {format(selectedRange.from, 'PPP')} - {format(selectedRange.to, 'PPP')}
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>• Red crossed-out dates are already booked</p>
              <p>• Select your check-in and check-out dates</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={guestInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={guestInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={guestInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('dates')}
              >
                Back to Calendar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;