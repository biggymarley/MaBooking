// hooks/useRoomManagement.ts
import { useState, useEffect } from 'react';
import { roomApi, Room, RoomFormData } from '../api/roomApi';

export const useRoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    description: '',
    price: '',
    images: null
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setError(null);
      const data = await roomApi.getAllRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        images: e.target.files
      });

      const urls: string[] = [];
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          urls.push(reader.result as string);
          setPreviewUrls([...urls]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      
      if (formData.images) {
        Array.from(formData.images).forEach((image) => {
          formDataToSend.append('images', image);
        });
      }

      if (isEditing) {
        await roomApi.updateRoom(isEditing, formDataToSend);
      } else {
        await roomApi.createRoom(formDataToSend);
      }

      resetForm();
      fetchRooms();
    } catch (err) {
      setError('Failed to save room');
      console.error('Error saving room:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room: Room) => {
    setIsEditing(room._id);
    setFormData({
      name: room.name,
      description: room.description,
      price: room.price.toString(),
      images: null
    });
    setIsAdding(true);
  };

  const handleDelete = async (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        setError(null);
        await roomApi.deleteRoom(roomId);
        fetchRooms();
      } catch (err) {
        setError('Failed to delete room');
        console.error('Error deleting room:', err);
      }
    }
  };

  const handleSetMainImage = async (roomId: string, imageId: string) => {
    try {
      setError(null);
      await roomApi.setMainImage(roomId, imageId);
      fetchRooms();
    } catch (err) {
      setError('Failed to set main image');
      console.error('Error setting main image:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      images: null
    });
    setPreviewUrls([]);
    setIsAdding(false);
    setIsEditing(null);
    setError(null);
  };

  return {
    rooms,
    isAdding,
    isEditing,
    loading,
    error,
    formData,
    previewUrls,
    setIsAdding,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSetMainImage,
    resetForm
  };
};