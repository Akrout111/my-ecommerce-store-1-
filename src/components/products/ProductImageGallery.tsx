"use client";

import { useState } from "react";
import Image from "next/image";
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
  women: "from-[#C9A96E]/40 to-[#E8A0BF]/40",
  men: "from-[#1A1510]/60 to-[#2A2A2A]/80",
  kids: "from-[#E8A0BF]/30 to-[#F5D5E0]/30",
  accessories: "from-[#D4B98A]/40 to-[#C9A96E]/40",
  shoes: "from-[#1A1A2E]/60 to-[#0F0F0F]/80",
  beauty: "from-[#F5D5E0]/30 to-[#E8A0BF]/40",
  sportswear: "from-[#2D5A27]/50 to-[#1A3A15]/60",
  luxury: "from-[#C9A96E]/50 to-[#8B6914]/60",
};

export function ProductImageGallery({ images, category, className }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gradient = categoryGradients[category?.toLowerCase() ?? ""] ?? "from-[#C9A96E]/30 to-[#E8A0BF]/30";

  const displayImages = images && images.length > 0
    ? images
    : [
        { url: "", alt: "Product image 1" },
        { url: "", alt: "Product image 2" },
        { url: "", alt: "Product image 3" },
      ];

  return (
    <div className={cn("space-y-3", className)}>
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className={cn("relative aspect-square rounded-lg bg-gradient-to-br overflow-hidden", gradient)}>
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <Image
                    src="/images/placeholder-product.svg"
                    alt="Product placeholder"
                    fill
                    className="rounded-lg object-contain p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3" />
        <CarouselNext className="-right-3" />
      </Carousel>

      <div className="flex gap-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative h-16 w-16 rounded-md bg-gradient-to-br overflow-hidden transition-all",
              gradient,
              selectedIndex === index
                ? "ring-2 ring-[#C9A96E] ring-offset-2"
                : "opacity-60 hover:opacity-100"
            )}
          >
            {image.url ? (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Image
                  src="/images/placeholder-product.svg"
                  alt="Placeholder"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
