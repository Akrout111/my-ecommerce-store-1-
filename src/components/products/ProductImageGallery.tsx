"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images?: { url: string; alt: string }[];
  category?: string;
  className?: string;
}

const categoryGradients: Record<string, string> = {
  electronics: "from-cyan-500 to-teal-600",
  fashion: "from-pink-500 to-rose-600",
  home: "from-amber-500 to-orange-600",
  beauty: "from-purple-500 to-fuchsia-600",
  sports: "from-emerald-500 to-green-600",
  books: "from-yellow-500 to-amber-600",
  toys: "from-red-500 to-pink-600",
  groceries: "from-lime-500 to-green-600",
};

export function ProductImageGallery({ images, category, className }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gradient = categoryGradients[category?.toLowerCase() ?? ""] ?? "from-emerald-500 to-teal-600";

  // Use placeholder images if no real images
  const displayImages = images && images.length > 0
    ? images
    : [
        { url: "", alt: "Product image 1" },
        { url: "", alt: "Product image 2" },
        { url: "", alt: "Product image 3" },
      ];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Image Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className={cn("aspect-square rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-20 w-20 text-white/30" />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3" />
        <CarouselNext className="-right-3" />
      </Carousel>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "h-16 w-16 rounded-md bg-gradient-to-br overflow-hidden transition-all",
              gradient,
              selectedIndex === index
                ? "ring-2 ring-emerald-600 ring-offset-2"
                : "opacity-60 hover:opacity-100"
            )}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white/30" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
