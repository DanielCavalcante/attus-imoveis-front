"use client";

import React, { createContext, useContext, useState } from "react";

export type PropertyType = "HOUSE" | "APARTMENT" | "CONDOMINIUM" | "LAND";
export type TipoTransacao = "vender" | "alugar" | "";

export interface AnuncioFormData {
  tipoTransacao: TipoTransacao;
  tipoImovel: PropertyType | null;
  quartos: number;
  banheiros: number;
  suites: number;
  vagasGaragem: number;
  areaUtil: string;
  areaTotal: string;
  titulo: string;
  descricao: string;
  valor: string;
}

const STORAGE_KEY = "anuncio-form-data";

const defaultFormData: AnuncioFormData = {
  tipoTransacao: "",
  tipoImovel: null,
  quartos: 0,
  banheiros: 0,
  suites: 0,
  vagasGaragem: 0,
  areaUtil: "",
  areaTotal: "",
  titulo: "",
  descricao: "",
  valor: "",
};

interface AnuncioFormContextType {
  formData: AnuncioFormData;
  setFormData: React.Dispatch<React.SetStateAction<AnuncioFormData>>;
}

const AnuncioFormContext = createContext<AnuncioFormContextType | undefined>(
  undefined,
);

export function AnuncioFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [formData, setFormDataState] = useState<AnuncioFormData>(() => {
    if (typeof window === "undefined") return defaultFormData;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {

    }
    return defaultFormData;
  });

  const setFormData: React.Dispatch<React.SetStateAction<AnuncioFormData>> = (
    action,
  ) => {
    setFormDataState((prev) => {
      const nextData = typeof action === "function" ? action(prev) : action;
      
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
      }
      
      return nextData;
    });
  };

  return (
    <AnuncioFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </AnuncioFormContext.Provider>
  );
}

export function useAnuncioForm() {
  const context = useContext(AnuncioFormContext);
  if (!context) {
    throw new Error(
      "useAnuncioForm precisa ser usado dentro de um AnuncioFormProvider",
    );
  }
  return context;
}