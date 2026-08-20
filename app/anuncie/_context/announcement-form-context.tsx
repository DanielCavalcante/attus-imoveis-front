"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { announcementSchema } from "@/app/schemas/announcement";

export type AnnouncementFormData = z.infer<typeof announcementSchema>;

const STORAGE_KEY = "listing-form-data";

const defaultFormData: AnnouncementFormData = {
  reason: "SALE",
  propertyType: "HOUSE",
  rooms: 0,
  bathRooms: 0,
  suites: 0,
  garageSpaces: 0,
  area: 0,
  totalArea: 0,
  title: "",
  description: "",
  price: 0,
  cep: "",
  street: "",
  streetNumber: 0,
  city: "",
  state: "",
  complement: "",
  images: [],
};

interface ListingFormContextType {
  formData: AnnouncementFormData;
  setFormData: React.Dispatch<React.SetStateAction<AnnouncementFormData>>;
  isHydrated: boolean;
}

const AnnouncementFormContext = createContext<ListingFormContextType | undefined>(
  undefined,
);

export function AnnouncementFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormDataState] =
    useState<AnnouncementFormData>(defaultFormData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const storedData = sessionStorage.getItem(STORAGE_KEY);

        if (storedData) {
          setFormDataState({ ...defaultFormData, ...JSON.parse(storedData) });
        }
      } catch {}

      setIsHydrated(true);
    });
  }, []);

  const setFormData: React.Dispatch<React.SetStateAction<AnnouncementFormData>> = (
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
    <AnnouncementFormContext.Provider
      value={{ formData, setFormData, isHydrated }}
    >
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