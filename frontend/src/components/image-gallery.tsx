import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const nextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <div>
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/80 p-4"
          onClick={() => {
            setZoomed(false);
          }}
        >
          <div className="relative flex w-full max-w-5xl items-center justify-center">
            <Button
              variant="secondary"
              className="absolute top-4 right-4"
              onClick={() => setZoomed(false)}
            >
              <X size={28} />
            </Button>

            <Button
              variant="secondary"
              className="absolute left-4"
              onClick={prevImage}
            >
              <ChevronLeft size={40} />
            </Button>

            <img
              key={currentImgIndex}
              src={images[currentImgIndex]}
              alt="Zoomed image"
              className="max-h-[70vh] w-full max-w-full object-contain"
            />

            <Button
              variant="secondary"
              className="absolute right-4"
              onClick={nextImage}
            >
              <ChevronRight size={40} />
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        <img
          src={images[currentImgIndex]}
          alt={`Image ${currentImgIndex + 1}`}
          className="h-96 w-full cursor-zoom-in rounded-lg object-cover"
          onClick={() => setZoomed(true)}
        />

        <Button
          variant="secondary"
          className="absolute top-1/2 left-2 -translate-y-1/2 transform"
          onClick={prevImage}
        >
          <ChevronLeft />
        </Button>

        <Button
          variant="secondary"
          className="absolute top-1/2 right-2 -translate-y-1/2 transform"
          onClick={nextImage}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            className={`h-20 w-20 cursor-pointer rounded border-2 object-cover transition ${
              idx === currentImgIndex
                ? "border-primary shadow-md"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
            onClick={() => setCurrentImgIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
