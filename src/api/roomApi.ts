import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export interface RoomFormData {
  name: string;
  description: string;
  price: string;
  images: FileList | null;
}

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

export const roomApi = {
  getAllRooms: async () => {
    const response = await axios.get<Room[]>(`${BASE_URL}/rooms`);
    return response.data;
  },

  createRoom: async (formData: FormData) => {
    const response = await axios.post(`${BASE_URL}/rooms`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateRoom: async (roomId: string, formData: FormData) => {
    const response = await axios.put(`${BASE_URL}/rooms/${roomId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteRoom: async (roomId: string) => {
    const response = await axios.delete(`${BASE_URL}/rooms/${roomId}`);
    return response.data;
  },

  setMainImage: async (roomId: string, imageId: string) => {
    const response = await axios.patch(
      `${BASE_URL}/rooms/${roomId}/images/${imageId}/main`
    );
    return response.data;
  }
};