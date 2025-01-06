import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RoomImage {
  _id: string;
  url: string;
  isMainImage: boolean;
}

interface RoomCarouselProps {
  images: RoomImage[];
  className?: string;
}

const RoomCarousel: React.FC<RoomCarouselProps> = ({ images, className = "" }) => {
  return (
    <Carousel className={`w-full ${className}`}>
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image._id}>
            <div className="relative aspect-video p-1">
              <img
                src={image.url}
                alt="Room view"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default RoomCarousel;