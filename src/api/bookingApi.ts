// services/api/bookingManagementApi.ts
import axios from 'axios';

const BASE_URL = 'https://mabookingbackend.onrender.com/api';

export interface Booking {
    _id: string;
    roomId: string;
    room?: {
        _id: string;
        name: string;
        price: number;
    };
    startDate: string;
    endDate: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export interface Room {
    _id: string;
    name: string;
    price: number;
}

export const bookingApi = {
    getAllBookings: async () => {
        const response = await axios.get<Booking[]>(`${BASE_URL}/bookings`);
        return response.data;
    },

    getGuestBookings: async (email: string) => {
        const response = await axios.get<Booking[]>(`${BASE_URL}/bookings/guest/${email}`);
        return response.data;
    },

    getRoomBookings: async (roomId: string) => {
        const response = await axios.get<Booking[]>(`${BASE_URL}/bookings/room/${roomId}`);
        return response.data;
    },

    updateBookingStatus: async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
        const response = await axios.patch(`${BASE_URL}/bookings/${bookingId}/status`, { status });
        return response.data;
    },
    deleteBooking: async (bookingId: string) => {
        const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
        return response.data;
    }
};