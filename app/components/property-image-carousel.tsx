"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface PropertyImageCarouselProps {
  images: string[];
  alt: string;
}

export function PropertyImageCarousel({
  images,
  alt,
}: PropertyImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={img} className="relative h-52 w-full flex-[0_0_100%]">
              <Image
                src={img}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute flex gap-2 -translate-x-1/2 bottom-2 left-1/2">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              aria-label={`Ver imagem ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                i === selectedIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}