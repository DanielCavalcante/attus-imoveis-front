



"use client";

import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Bath, BedDouble, MapPin, Square } from "lucide-react";
import { PropertyImageCarousel } from "@/app/components/property-image-carousel";

const properties = [
  {
    id: 1,
    title: "Apartamento Moderno",
    city: "João Pessoa - PB",
    price: "R$ 450.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    images: [
      "/images/hero-property-facade.jpg",
      "/images/hero-property-facade-01.jpg",
    ],
  },
  {
    id: 2,
    title: "Casa em Condomínio",
    city: "Cabedelo - PB",
    price: "R$ 790.000",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    images: [
      "/images/hero-property-facade-01.jpg",
      "/images/hero-property-facade-02.jpg",
    ],
  },
  {
    id: 3,
    title: "Cobertura Vista Mar",
    city: "João Pessoa - PB",
    price: "R$ 1.250.000",
    bedrooms: 4,
    bathrooms: 4,
    area: 250,
    images: [
      "/images/hero-property-facade-02.jpg",
      "/images/hero-property-facade-03.jpg",
    ],
  },
  {
    id: 4,
    title: "Apartamento Compacto",
    city: "Bayeux - PB",
    price: "R$ 220.000",
    bedrooms: 2,
    bathrooms: 1,
    area: 60,
    images: [
      "/images/hero-property-facade-03.jpg",
      "/images/hero-property-facade-04.jpg",
    ],
  },
  {
    id: 5,
    title: "Apartamento em Jacumã",
    city: "Bayeux - PB",
    price: "R$ 220.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    images: [
      "/images/hero-property-facade-04.jpg",
      "/images/hero-property-facade.jpg",
    ],
  },
  {
    id: 6,
    title: "Apartamento em Jacumã",
    city: "Bayeux - PB",
    price: "R$ 220.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    images: [
      "/images/hero-property-facade-04.jpg",
      "/images/hero-property-facade.jpg",
    ],
  },
  {
    id: 7,
    title: "Apartamento em Jacumã",
    city: "Bayeux - PB",
    price: "R$ 220.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    images: [
      "/images/hero-property-facade-04.jpg",
      "/images/hero-property-facade.jpg",
    ],
  },
];

export function FeaturedProperties() {
  return (
    <section className="container py-16 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="w-full text-center lg:text-left">
          <h2 className="text-3xl font-bold">Imóveis em destaque</h2>

          <p className="text-muted-foreground">
            Confira os imóveis mais visitados da semana.
          </p>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem
              key={property.id}
              className="sm:basis-1/2 md:basis-1/2 lg:basis-1/4"
            >
              <Card className="overflow-hidden">
                <PropertyImageCarousel
                  images={property.images}
                  alt={property.title}
                />

                <CardContent className="p-4 space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {property.price}
                    </p>

                    <h3 className="mt-2 font-semibold">{property.title}</h3>

                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {property.city}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4" />
                      {property.bedrooms}
                    </div>

                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms}
                    </div>

                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.area}m²
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/imoveis/${property.id}`}>Ver detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 lg:-left-12" />
        <CarouselNext className="right-2 lg:-right-12" />
      </Carousel>
    </section>
  );
}