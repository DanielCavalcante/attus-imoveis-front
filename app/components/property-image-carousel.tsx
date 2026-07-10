"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface PropertyImageCarouselProps {
  images: string[];
  alt: string;
}

export function PropertyImageCarousel({
  images,
  alt,
}: PropertyImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // useState com inicializador lazy: cria a instância do plugin uma
  // única vez, sem ler .current durante o render.
  const [autoplay] = useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={img}>
              <div className="relative h-52 w-full">
                <Image
                  src={img}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots — shadcn não tem indicador nativo, então continuam manuais */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              aria-label={`Ver imagem ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === selectedIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}