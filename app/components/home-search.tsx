"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/auth-context"; // project's own hook (AuthProvider)
import { ChevronDown, Loader2, Search } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SEARCH_ENDPOINT = "/api/properties/search";

type PropertySearchOption = {
  value: string;
  label: string;
};

const PROPERTY_OPTIONS: PropertySearchOption[] = [
  { value: "RENT", label: "Alugar" },
  { value: "BUY", label: "Comprar" },
];

type TypePropertyOption = {
  id: string;
  label: string;
};

const TYPE_PROPERTY_OPTIONS: TypePropertyOption[] = [
  { id: "APARTMENT", label: "Apartamento" },
  { id: "LAND", label: "Terreno" },
  { id: "HOUSE", label: "Casa" },
  { id: "STUDIOS", label: "Estúdios" }
];

const searchPayloadSchema = z.object({
  purpose: z.enum(["RENT", "BUY"], {
    message: "Selecione uma finalidade válida (alugar ou comprar).",
  }),
  propertyTypes: z
    .array(z.string())
    .min(1, "Selecione pelo menos um tipo de imóvel."),
  userId: z.number().nullable(),
});

type PropertySearchPayload = z.infer<typeof searchPayloadSchema>;

export default function SearchHero() {
  const { user, token } = useAuth(); // user?.id and token come from AuthProvider (decoded JWT)

  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySelected, setPropertySelected] = useState<string>("RENT");

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeSelected, setTypeSelected] = useState<string[]>(["APARTMENT"]);

  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  function toggleTypeProperty(id: string) {
    setTypeSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  const propertyLabel =
    PROPERTY_OPTIONS.find((opt) => opt.value === propertySelected)?.label ??
    "Selecione";

  const typeLabel =
    typeSelected.length === 0
      ? "Selecione"
      : typeSelected.length === 1
        ? TYPE_PROPERTY_OPTIONS.find((opt) => opt.id === typeSelected[0])?.label
        : `${typeSelected.length} tipos selecionados`;

  async function handleSearch() {
    setSearchError(null);

    const rawPayload = {
      purpose: propertySelected,
      propertyTypes: typeSelected,
      userId: user?.id ?? null,
    };

    const parsed = searchPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      setSearchError(
        parsed.error.issues[0]?.message ?? "Check the selected filters.",
      );
      return;
    }

    const payload: PropertySearchPayload = parsed.data;

    setIsSearching(true);
    try {
      const response = await fetch(SEARCH_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error searching for properties:", error);
      setSearchError("Não encontramos imóveis com os filtros selecionados. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="relative flex items-center w-full min-h-screen bg-transparent">
      
      <div className="absolute inset-0 overflow-hidden -z-10">
      
        <img
          src="/images/register.jpg"
          alt=""
          className="object-cover w-full h-full"
        />
      </div>

      <div className="relative z-50 w-full max-w-md mx-4 sm:ml-12 md:mx-auto lg:ml-24">
        <Card className="p-6 shadow-xl rounded-2xl sm:p-8">
          <CardContent className="p-0 space-y-6">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Encontre o imóvel dos seus sonhos
            </h1>

            <div className="space-y-4">
              <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left transition-colors border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">
                      O que você deseja?
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-gray-900">
                        {propertyLabel}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                          propertyOpen && "rotate-180",
                        )}
                      />
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-[var(--radix-popover-trigger-width)] rounded-xl p-2 shadow-2xl"
                >
                  <RadioGroup
                    value={propertySelected}
                    onValueChange={(value: string) => {
                      setPropertySelected(value);
                      setPropertyOpen(false);
                    }}
                  >
                    {PROPERTY_OPTIONS.map((opt) => {
                      const checked = propertySelected === opt.value;
                      return (
                        <Label
                          key={opt.value}
                          htmlFor={`property-${opt.value}`}
                          className={cn(
                            "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-normal transition-colors hover:bg-primary",
                            checked ? "bg-primary/50" : "",
                          )}
                        >
                          <RadioGroupItem
                            value={opt.value}
                            id={`property-${opt.value}`}
                          />
                          <span
                            className={cn(
                              "text-sm transition-colors group-hover:text-[#FFFFFF]",
                              checked
                                ? "font-semibold text-gray-900"
                                : "text-gray-700",
                            )}
                          >
                            {opt.label}
                          </span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </PopoverContent>
              </Popover>

              <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left transition-colors border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">
                      Tipo de imóvel
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-gray-900 truncate">
                        {typeLabel}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                          typeOpen && "rotate-180",
                        )}
                      />
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl p-0 shadow-2xl"
                >
                  <div className="overflow-y-auto max-h-72">
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Residential
                    </p>
                    {TYPE_PROPERTY_OPTIONS.map((opt) => {
                      const checked = typeSelected.includes(opt.id);
                      return (
                        <Label
                          key={opt.id}
                          htmlFor={`type-${opt.id}`}
                          className={cn(
                            "group flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 font-normal transition-colors first:border-t-0 hover:bg-primary",
                            checked ? "bg-primary/50" : "",
                          )}
                        >
                          <Checkbox
                            id={`type-${opt.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleTypeProperty(opt.id)}
                          />
                          <span
                            className={cn(
                              "text-sm transition-colors group-hover:text-[#FFFFFF]",
                              checked
                                ? "font-semibold text-gray-900"
                                : "text-gray-700",
                            )}
                          >
                            {opt.label}
                          </span>
                        </Label>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-gray-100">
                    <Button
                      type="button"
                      onClick={() => setTypeOpen(false)}
                      className="w-full bg-primary hover:bg-primary/80"
                    >
                      Apply {typeSelected.length} selected
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {searchError && (
              <p className="text-sm font-medium text-primary" role="alert">
                {searchError}
              </p>
            )}

            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              size="lg"
              className="w-full gap-2 bg-primary py-3.5 text-base hover:bg-primary/80 disabled:opacity-70"
            >
              {isSearching ? (
                "Buscando..."
              ) : (
                "Buscar imóveis"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
