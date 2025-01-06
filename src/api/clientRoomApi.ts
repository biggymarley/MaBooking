import axios from 'axios';

const BASE_URL = 'https://mabookingbackend.onrender.com/api';

export interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{
    _id: string;
    url: string;
    isMainImage: boolean;
  }>;
  isAvailable: boolean;
}

export interface BookingData {
  roomId: string;
  startDate: Date;
  endDate: Date;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

export const clientRoomApi = {
  getAllRooms: async () => {
    const response = await axios.get<Room[]>(`${BASE_URL}/rooms`);
    return response.data;
  },

  getRoom: async (roomId: string) => {
    const response = await axios.get<Room>(`${BASE_URL}/rooms/${roomId}`);
    return response.data;
  },

  checkAvailability: async (roomId: string, startDate: Date, endDate: Date) => {
    const response = await axios.get(`${BASE_URL}/rooms/${roomId}/availability`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    return response.data;
  },

  createBooking: async (bookingData: BookingData) => {
    const response = await axios.post(`${BASE_URL}/bookings`, bookingData);
    return response.data;
  }
};