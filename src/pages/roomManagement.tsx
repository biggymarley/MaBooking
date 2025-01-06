import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { useRoomManagement } from '../hooks/useRoomManagement';

const RoomDashboard: React.FC = () => {
  const {
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
  } = useRoomManagement();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Room
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per Night</label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Room Images</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  required={!isEditing}
                />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : isEditing ? 'Update Room' : 'Add Room'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Images</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell>
                  <div className="flex gap-2">
                    {room.images.map((image) => (
                      <div key={image._id} className="relative">
                        <img
                          src={image.url}
                          alt={room.name}
                          className={`w-16 h-16 object-cover rounded-md ${
                            image.isMainImage ? 'border-2 border-blue-500' : ''
                          }`}
                        />
                        {!image.isMainImage && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-0 right-0 p-1"
                            onClick={() => handleSetMainImage(room._id, image._id)}
                          >
                            <ImageIcon className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {room.description}
                </TableCell>
                <TableCell>${room.price}/night</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(room)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(room._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RoomDashboard;