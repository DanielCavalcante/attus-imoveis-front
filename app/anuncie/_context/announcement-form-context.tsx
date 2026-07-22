"use client";

import React, { createContext, useContext, useState } from "react";

export type PropertyType = "HOUSE" | "APARTMENT" | "CONDOMINIUM" | "LAND";
export type TransactionType = "sell" | "rent" | "";

export interface LocalFormData {
  transactionType: TransactionType;
  propertyType: PropertyType | null;
  rooms: number;
  bathrooms: number;
  suites: number;
  garageSpaces: number;
  area: string;
  totalArea: string;
  title: string;
  description: string;
  price: string;
  cep: string;
  street: string;
  streetNumber: string;
  city: string;
  state: string;
  complement: string;
  images: string[];
}

const STORAGE_KEY = "listing-form-data";

const defaultFormData: LocalFormData = {
  transactionType: "",
  propertyType: null,
  rooms: 0,
  bathrooms: 0,
  suites: 0,
  garageSpaces: 0,
  area: "",
  totalArea: "",
  title: "",
  description: "",
  price: "",
  cep: "",
  street: "",
  streetNumber: "",
  city: "",
  state: "",
  complement: "",
  images: [],
};

interface ListingFormContextType {
  formData: LocalFormData;
  setFormData: React.Dispatch<React.SetStateAction<LocalFormData>>;
}

const AnnouncementFormContext = createContext<
  ListingFormContextType | undefined
>(undefined);

export function AnnouncementFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormDataState] = useState<LocalFormData>(() => {
    if (typeof window === "undefined") return defaultFormData;

    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);

      if (storedData) {
        return { ...defaultFormData, ...JSON.parse(storedData) };
      }
    } catch {}

    return defaultFormData;
  });

  const setFormData: React.Dispatch<React.SetStateAction<LocalFormData>> = (
    action,
  ) => {
    setFormDataState((previousData) => {
      const updatedData =
        typeof action === "function" ? action(previousData) : action;

      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      }

      return updatedData;
    });
  };

  return (
    <AnnouncementFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </AnnouncementFormContext.Provider>
  );
}

export function useAnnouncementForm() {
  const context = useContext(AnnouncementFormContext);

  if (!context) {
    throw new Error(
      "O `useAnnouncementForm` deve ser utilizado dentro de um `AnnouncementFormProvider`.",
    );
  }

  return context;
}
