"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  searchPayloadSchema,
  buildPropertySearchUrl,
} from "@/app/services/property-search.service";

export const PROPERTY_OPTIONS = [
  { value: "RENT", label: "Alugar" },
  { value: "BUY", label: "Comprar" },
] as const;

export const TYPE_PROPERTY_OPTIONS = [
  { id: "APARTMENT", label: "Apartamento" },
  { id: "LAND", label: "Terreno" },
  { id: "HOUSE", label: "Casa" },
  { id: "STUDIOS", label: "Estúdios" },
] as const;

export function usePropertySearch() {
  const router = useRouter();

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

  function handleSearch() {
    setSearchError(null);

    const rawPayload = {
      purpose: propertySelected,
      propertyTypes: typeSelected,
    };

    const parsed = searchPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      setSearchError(
        parsed.error.issues[0]?.message ?? "Verifique os filtros selecionados.",
      );
      return;
    }

    setIsSearching(true);

    try {
      const url = buildPropertySearchUrl(parsed.data);
      router.push(url);
    } catch (error) {
      console.error("Erro ao montar a busca de imóveis:", error);
      setSearchError("Não foi possível iniciar a busca. Tente novamente.");
      setIsSearching(false);
    }
  }

  return {
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
  };
}