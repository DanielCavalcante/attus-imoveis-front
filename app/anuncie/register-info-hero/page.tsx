"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowLeft, Banknote, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAnnouncementForm } from "../_context/announcement-form-context";

export default function PropertyDescriptionPage() {
  const { formData, setFormData } = useAnnouncementForm();
  const [isPriceTouched, setIsPriceTouched] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, price: onlyNumbers }));
  };

  const formattedPrice = formData.price
    ? Number(formData.price).toLocaleString("pt-BR")
    : "0";

  const isRental = formData.transactionType === "rent";

  const sectionTitle = isRental ? "Valor de aluguel" : "Valor de venda";
  const fieldLabel = isRental ? "Valor do aluguel" : "Valor da venda";
  const errorMessage = isRental
    ? "Preencha o valor do aluguel"
    : "Preencha o valor da venda";

  const isPriceInvalid =
    isPriceTouched && (!formData.price || Number(formData.price) === 0);

  const handleSaveAndExit = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-row font-sans">
      <aside className="hidden md:flex flex-col justify-between bg-slate-950 p-12 text-white w-[400px] flex-shrink-0 min-h-screen">
        <div className="space-y-8">
          <div className="w-20 h-20 bg-transparent flex items-center justify-center rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/logotipo-icon.png"
              alt="Logo Encontrei"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight max-w-sm">
            Como você descreveria seu imóvel?
          </h1>
        </div>

        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            Precisa de ajuda?
          </button>
          <span>© 2026 Encontrei</span>
        </div>
      </aside>

      <main className="flex-1 bg-brand-white p-10 md:p-16 flex flex-col min-h-screen">
        <div className="max-w-6xl w-full mx-auto flex flex-col flex-1 min-h-0">
          <header className="mb-12 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Etapa 2 de 4
                </span>
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[50%] bg-brand rounded-full"></div>
                </div>
              </div>

              <Button
                variant="outline"
                className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50"
                onClick={handleSaveAndExit}
              >
                Salvar e sair
              </Button>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-10 pb-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-900"
                  >
                    Título <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-slate-500">
                    {formData.title?.length || 0}/100
                  </span>
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  maxLength={100}
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-lg border border-slate-300 px-4 text-base focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-900"
                  >
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <span className="text-sm text-slate-500">
                    {formData.description?.length || 0}/3000
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  maxLength={3000}
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base resize-y focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold">
                    <Banknote className="w-5 h-5" />
                    {sectionTitle}
                  </h3>
                  <p className="text-slate-600 mt-1.5">
                    Defina o preço de anúncio do imóvel. Você pode alterá-lo
                    quando quiser.
                  </p>
                </div>

                <div className="space-y-1.5 max-w-sm">
                  <label
                    htmlFor="price"
                    className={cn(
                      "text-sm font-medium",
                      isPriceInvalid ? "text-orange-600" : "text-slate-900",
                    )}
                  >
                    {fieldLabel} <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={cn(
                      "flex items-center h-12 rounded-lg border px-4 gap-2 focus-within:ring-2",
                      isPriceInvalid
                        ? "border-orange-500 focus-within:ring-orange-200"
                        : "border-slate-300 focus-within:ring-brand/40 focus-within:border-brand",
                    )}
                  >
                    <span className="font-semibold text-slate-700">R$</span>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      inputMode="numeric"
                      value={formattedPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      onBlur={() => setIsPriceTouched(true)}
                      className="flex-1 bg-transparent outline-none text-base text-slate-700"
                    />
                  </div>
                  {isPriceInvalid && (
                    <p className="flex items-center gap-1.5 text-sm text-orange-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errorMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-8 pt-8 border-t border-brand-white flex justify-between items-center shrink-0">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-slate-600 hover:bg-brand-white border border-slate-700 px-8 h-12 rounded-xl"
            >
              <Link href="/anuncie/register-info">
                <ArrowLeft className="w-5 h-5" /> Voltar
              </Link>
            </Button>
            <Button
              asChild
              className="bg-brand-dark text-brand-white px-8 h-12 rounded-xl gap-2 hover:bg-brand-light"
            >
              <Link href="/anuncie/register-location">
                Continuar <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}