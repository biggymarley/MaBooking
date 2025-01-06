export interface Booking {
    id: string;
    roomId: string;
    startDate: string;
    endDate: string;
    guestName: string;
    guestEmail: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }
  
  export interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
  }
  
  export interface RoomBookingCalendarProps {
    roomId: string;
    onBookingSubmit?: (range: DateRange) => void;
  }