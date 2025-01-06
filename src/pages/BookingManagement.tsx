import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { differenceInDays, format, parseISO } from 'date-fns';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  CalendarRange,
  Building,
  DollarSign,
  Trash2
} from 'lucide-react';
import { bookingApi, Booking } from '../api/bookingApi';

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  confirmed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  cancelled: <XCircle className="w-4 h-4 text-red-500" />
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'upcoming' | 'past' | 'all'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getAllBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(booking => new Date(booking.startDate) >= now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(booking => new Date(booking.endDate) < now);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.guestName.toLowerCase().includes(search) ||
        booking.guestEmail.toLowerCase().includes(search) ||
        booking.guestPhone.includes(search)
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      await bookingApi.updateBookingStatus(bookingId, newStatus);
      const updatedBookings = bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating status:', err);
    }
  };
  const calculateTotalPrice = (booking: Booking) => {
    if (!booking.room?.price) return 0;

    const startDate = parseISO(booking.startDate);
    const endDate = parseISO(booking.endDate);
    const nights = differenceInDays(endDate, startDate);

    return nights * booking.room.price;
  };
  const handleDelete = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingApi.deleteBooking(bookingId);
        // Remove the deleted booking from state
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        setError(null);
      } catch (err) {
        setError('Failed to delete booking');
        console.error('Error deleting booking:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Booking Management</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search guest or contact..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateFilter}
              onValueChange={(value: 'upcoming' | 'past' | 'all') => setDateFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={fetchBookings}
              className="flex items-center gap-2"
            >
              <CalendarRange className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => {
              const totalPrice = calculateTotalPrice(booking);
              const nights = differenceInDays(parseISO(booking.endDate), parseISO(booking.startDate));

              return (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {booking.room?.name || 'Unknown Room'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{booking.guestName}</div>
                      <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                      <div className="text-sm text-gray-500">{booking.guestPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 font-medium">
                        <DollarSign className="h-4 w-4" />
                        {totalPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${booking.room?.price}/night
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>
                        {format(parseISO(booking.startDate), 'MMM d, yyyy')} -
                        {format(parseISO(booking.endDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {nights} {nights === 1 ? 'night' : 'nights'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Booked: {format(parseISO(booking.createdAt), 'PPp')}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
                      {statusIcons[booking.status]}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </TableCell>
                 
                  <TableCell>
                    <div className="flex items-center gap-2">
                    <Select
                      value={booking.status}
                      onValueChange={(value: 'pending' | 'confirmed' | 'cancelled') =>
                        handleStatusChange(booking._id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirm</SelectItem>
                        <SelectItem value="cancelled">Cancel</SelectItem>
                      </SelectContent>
                    </Select>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(booking._id)}
                        disabled={booking.status === 'confirmed'}
                        title={
                          booking.status === 'confirmed'
                            ? 'Cannot delete confirmed bookings'
                            : 'Delete booking'
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BookingManagement;