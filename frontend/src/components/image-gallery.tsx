import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={images[currentImgIndex]}
          alt={`Image ${currentImgIndex + 1}`}
          className="h-96 w-full rounded-lg object-cover"
        />
        <Button
          variant="ghost"
          className="absolute top-1/2 left-2 -translate-y-1/2 transform"
          onClick={() =>
            setCurrentImgIndex((prev) =>
              prev > 0 ? prev - 1 : images.length - 1,
            )
          }
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          className="absolute top-1/2 right-2 -translate-y-1/2 transform"
          onClick={() =>
            setCurrentImgIndex((prev) =>
              prev < images.length - 1 ? prev + 1 : 0,
            )
          }
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
            className={`h-20 w-20 cursor-pointer rounded object-cover ${idx === currentImgIndex ? "border-primary border-2" : ""}`}
            onClick={() => setCurrentImgIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
