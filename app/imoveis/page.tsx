export default function PropertiesPage() {
  const properties = [
    {
      id: 1,
      title: "Casa moderna com piscina",
      price: "R$ 850.000",
      city: "João Pessoa - PB",
      bedrooms: 4,
      bathrooms: 3,
      area: "240m²",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Apartamento alto padrão",
      price: "R$ 620.000",
      city: "Campina Grande - PB",
      bedrooms: 3,
      bathrooms: 2,
      area: "120m²",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Cobertura duplex luxuosa",
      price: "R$ 1.250.000",
      city: "Recife - PE",
      bedrooms: 5,
      bathrooms: 4,
      area: "380m²",
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Casa em condomínio fechado",
      price: "R$ 540.000",
      city: "Natal - RN",
      bedrooms: 3,
      bathrooms: 2,
      area: "180m²",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Anúncios de Imóveis
            </h1>

            <p className="text-muted-foreground">
              Explore os imóveis disponíveis na plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              placeholder="Buscar imóvel..."
              className="h-10 rounded-md border bg-background px-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />

            <select className="h-10 rounded-md border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option>Mais recentes</option>
              <option>Maior preço</option>
              <option>Menor preço</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  Destaque
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h2 className="line-clamp-1 text-xl font-semibold">
                    {property.title}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {property.city}
                  </p>
                </div>

                <div>
                  <span className="text-2xl font-bold">{property.price}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-3 text-center text-sm">
                  <div>
                    <p className="font-semibold">{property.bedrooms}</p>

                    <span className="text-muted-foreground">Quartos</span>
                  </div>

                  <div>
                    <p className="font-semibold">{property.bathrooms}</p>

                    <span className="text-muted-foreground">Banheiros</span>
                  </div>

                  <div>
                    <p className="font-semibold">{property.area}</p>

                    <span className="text-muted-foreground">Área</span>
                  </div>
                </div>

                <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
