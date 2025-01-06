import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { clientRoomApi, Room } from '../api/clientRoomApi';
import BookingCalendar from './BookingCalendar';
import RoomCarousel from '@/components/RoomCarousel';
import ImageViewer from '@/components/ImageViewer';

const RoomListing: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await clientRoomApi.getAllRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = (room: Room) => {
    const mainImage = room.images.find(img => img.isMainImage);
    return mainImage ? mainImage.url : room.images[0]?.url;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading rooms...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Available Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room._id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={getMainImage(room)}
                alt={room.name}
                className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{room.name}</span>
                <span className="text-xl font-bold">${room.price}/night</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {room.description}
              </p>
              <Button
                className="w-full"
                onClick={() => setSelectedRoom(room)}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog
        open={!!selectedRoom}
        onOpenChange={() => setSelectedRoom(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedRoom && (
            <div className="grid gap-4">
              <RoomCarousel
                images={selectedRoom.images}
                className="rounded-lg"
              />
              <div className="grid grid-cols-4 gap-2">
                {selectedRoom.images.map((image) => (
                  <img
                    key={image._id}
                    src={image.url}
                    alt={selectedRoom.name}
                    onClick={() => setSelectedImage(image.url)}
                    className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                  />
                ))}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                <p className="text-xl text-blue-600 font-semibold">
                  ${selectedRoom.price}/night
                </p>
                <p className="mt-2">{selectedRoom.description}</p>
              </div>

              <BookingCalendar
                roomId={selectedRoom._id}
                onBookingComplete={() => setSelectedRoom(null)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ImageViewer
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default RoomListing;