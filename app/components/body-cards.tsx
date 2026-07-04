"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Bath, BedDouble, MapPin, Square } from "lucide-react";

const properties = [
  {
    id: 1,
    title: "Apartamento Moderno",
    city: "João Pessoa - PB",
    price: "R$ 450.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 85,
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
  },
  {
    id: 2,
    title: "Casa em Condomínio",
    city: "Cabedelo - PB",
    price: "R$ 790.000",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
  },
  {
    id: 3,
    title: "Cobertura Vista Mar",
    city: "João Pessoa - PB",
    price: "R$ 1.250.000",
    bedrooms: 4,
    bathrooms: 4,
    area: 250,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  },
  {
    id: 4,
    title: "Apartamento Compacto",
    city: "Bayeux - PB",
    price: "R$ 220.000",
    bedrooms: 2,
    bathrooms: 1,
    area: 60,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
  },
  {
    id: 5,
    title: "Apartamento em Jacumã",
    city: "Bayeux - PB",
    price: "R$ 220.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 80,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
  },
];

export function FeaturedProperties() {
  return (
    <section className="container mx-auto py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Imóveis em destaque
          </h2>

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
          {properties.map((property, index) => (
            <CarouselItem
              key={property.id}
              className="md:basis-1/2 lg:basis-1/4"
            >
              <Card className="overflow-hidden">
                <div className="relative h-52 w-full">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>

                <CardContent className="space-y-4 p-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {property.price}
                    </p>

                    <h3 className="mt-2 font-semibold">
                      {property.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {property.city}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" />
                      {property.bedrooms}
                    </div>

                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms}
                    </div>

                    <div className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {property.area}m²
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                  >
                    <Link
                      href={`/imoveis/${property.id}`}
                    >
                      Ver detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
