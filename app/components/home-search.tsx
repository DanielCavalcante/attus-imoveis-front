"use client";

import Image from "next/image";
import { ChevronDown, Loader2, Search } from "lucide-react";

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

import {
  usePropertySearch,
  PROPERTY_OPTIONS,
  TYPE_PROPERTY_OPTIONS,
} from "@/app/hooks/use-property-search";

export default function SearchHero() {
  const {
    propertyOpen,
    setPropertyOpen,
    propertySelected,
    setPropertySelected,
    propertyLabel,

    typeOpen,
    setTypeOpen,
    typeSelected,
    toggleTypeProperty,
    typeLabel,

    isSearching,
    searchError,
    handleSearch,
  } = usePropertySearch();

  return (
    <section className="relative flex min-h-screen w-full items-center bg-transparent">
      {/* Background image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/register.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Search card */}
      <div className="relative z-50 mx-4 w-full max-w-md sm:ml-12 lg:ml-24">
        <Card className="rounded-2xl p-6 shadow-xl sm:p-8">
          <CardContent className="space-y-6 p-0">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Encontre o imóvel dos seus sonhos
            </h1>

            <div className="space-y-4">
              <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={propertyOpen}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                    aria-haspopup="listbox"
                    aria-expanded={typeOpen}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">
                      Tipo de imóvel
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-base font-semibold text-gray-900">
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
                  <div className="max-h-72 overflow-y-auto">
                    <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
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

                  <div className="border-t border-gray-100 p-3">
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
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Buscar imóveis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}