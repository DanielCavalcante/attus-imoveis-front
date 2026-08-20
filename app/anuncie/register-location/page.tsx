"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ArrowLeft } from "lucide-react";
import {
  useAnnouncementForm,
} from "../_context/announcement-form-context";
import { announcementSchema } from "@/app/schemas/announcement";

export default function RegisterLocation() {
  const { formData, setFormData } = useAnnouncementForm();
  const router = useRouter();
  const [cepNotFound, setCepNotFound] = useState(false);

  const handleSaveAndExit = () => {
    router.push("/");
  };

  const handleCepChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
    setCepNotFound(false);
    setFormData((prev) => ({
      ...prev,
      cep: onlyNumbers,
    }));
  };

  const handleFieldChange =
    (field: "street" | "complement" | "city" | "state") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleStreetNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const numericValue = Number(event.target.value.replace(/\D/g, ""));
    setFormData((prev) => ({ ...prev, streetNumber: numericValue }));
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = formData.cep.replace(/\D/g, "");

      if (cleanCep.length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${cleanCep}/json/`,
          );
          const addressData = await response.json();

          if (!addressData.erro) {
            setCepNotFound(false);
            setFormData((prev) => ({
              ...prev,
              street: addressData.logradouro,
              city: addressData.localidade,
              state: addressData.uf,
            }));
          } else {
            setCepNotFound(true);
          }
        } catch (error) {
          console.error("Erro ao buscar o CEP:", error);
        }
      }
    };

    fetchAddress();
  }, [formData.cep, setFormData]);

  const locationValidation = announcementSchema
    .pick({ cep: true, street: true, city: true, state: true })
    .safeParse({
      cep: formData.cep,
      street: formData.street,
      city: formData.city,
      state: formData.state,
    });

  const canContinue = locationValidation.success && formData.streetNumber > 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      <aside className="hidden md:flex flex-col justify-between bg-slate-950 p-12 text-white w-[400px] flex-shrink-0 min-h-screen">
        <div className="space-y-8">
          <div className="w-20 h-20 bg-transparent flex items-center justify-center rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/logotipo-icon.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight max-w-sm">
            Onde fica seu imóvel?
          </h1>
        </div>

        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <button
            type="button"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            Precisa de ajuda?
          </button>

          <span>© 2026 Encontrei</span>
        </div>
      </aside>

      <main className="flex-1 bg-brand-white p-6 sm:p-10 md:p-16 flex flex-col">
        <div className="max-w-6xl w-full mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
          <header className="mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Etapa 3 de 4
                </span>

                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[50%] bg-brand rounded-full"></div>
                </div>
              </div>

              <Button
                variant="outline"
                className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50 self-start sm:self-auto"
                onClick={handleSaveAndExit}
              >
                Salvar e Sair
              </Button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto w-full space-y-10 md:space-y-12 flex-grow">
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Endereço
                </h2>

                <p className="text-slate-600 mt-1.5">
                  Informe o CEP para preenchermos o endereço automaticamente,
                  ou digite manualmente se preferir.
                </p>
              </div>

              <div className="space-y-2 max-w-xs">
                <Label htmlFor="cep">CEP</Label>

                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(event) => handleCepChange(event.target.value)}
                  placeholder="01010000"
                  inputMode="numeric"
                  maxLength={8}
                  className="border-slate-200 h-12"
                />

                {cepNotFound && (
                  <p className="text-sm text-amber-600">
                    Não encontramos esse CEP. Preencha o endereço manualmente
                    abaixo.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>

                <Input
                  id="street"
                  value={formData.street}
                  onChange={handleFieldChange("street")}
                  placeholder="Nome da rua"
                  className="border-slate-200 h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetNumber">Número</Label>

                  <Input
                    id="streetNumber"
                    inputMode="numeric"
                    value={formData.streetNumber || ""}
                    onChange={handleStreetNumberChange}
                    placeholder="123"
                    className="border-slate-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento (opcional)</Label>

                  <Input
                    id="complement"
                    value={formData.complement ?? ""}
                    onChange={handleFieldChange("complement")}
                    placeholder="Apto, bloco, referência..."
                    className="border-slate-200 h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>

                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleFieldChange("city")}
                    placeholder="Sua cidade"
                    className="border-slate-200 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>

                  <Input
                    id="state"
                    value={formData.state}
                    onChange={handleFieldChange("state")}
                    placeholder="UF"
                    maxLength={2}
                    className="border-slate-200 h-12 uppercase"
                  />
                </div>
              </div>
            </section>
          </div>

          <footer className="mt-10 md:mt-16 pt-8 border-t border-brand-white flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-slate-600 hover:bg-brand-white border border-slate-700 px-8 h-12 rounded-xl justify-center"
            >
              <Link href="/anuncie/register-info-hero">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </Link>
            </Button>

            <Button
              asChild={canContinue}
              disabled={!canContinue}
              className="bg-brand-dark text-brand-white px-8 h-12 rounded-xl gap-2 hover:bg-brand-light disabled:opacity-50 disabled:pointer-events-none justify-center"
            >
              {canContinue ? (
                <Link href="/anuncie/register-image">
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}