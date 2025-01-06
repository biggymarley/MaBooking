// components/ImageViewer.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageViewerProps {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="w-auto h-auto max-h-[90vh] p-0">
        <img
          src={imageUrl}
          alt="Full size view"
          className="w-full h-full object-contain"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;