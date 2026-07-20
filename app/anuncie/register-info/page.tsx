"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ArrowLeft,
  Minus,
  Plus,
  SlidersHorizontal,
  Ruler,
  Bed,
  ShowerHead,
  Car,
  Info,
  Check,
  Building2,
  Home,
  Building,
  LandPlot,
} from "lucide-react";
import Link from "next/link";
import {
  useAnnouncementForm,
  PropertyType,
  LocalFormData,
  
 
} from "../_context/announcement-form-context";

const propertyTypes: {
  id: PropertyType;
  name: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "APARTMENT",
    name: "Apartamento",
    icon: <Building2 className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "HOUSE",
    name: "Casas &\nSobrados",
    icon: <Home className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "CONDOMINIUM",
    name: "Casa em\ncondomínio",
    icon: <Building className="w-7 h-7" strokeWidth={1.5} />,
  },
  {
    id: "LAND",
    name: "Terreno",
    icon: <LandPlot className="w-7 h-7" strokeWidth={1.5} />,
  },
];

type CounterField = "bedrooms" | "bathrooms" | "suites" | "garageSpaces";

export default function CadastroImovelPage() {
  const { formData, setFormData } = useAnnouncementForm();
  const router = useRouter();

  const handleSelectPropertyType = (id: PropertyType) => {
    setFormData((prev: LocalFormData) => ({
      ...prev,
      propertyType: id,
    }));
  };

  const handleCounterChange = (field: CounterField, delta: number) => {
    setFormData((prev: LocalFormData) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta),
    }));
  };

  const handleAreaChange = (
    field: "usableArea" | "totalArea",
    value: string,
  ) => {
    const onlyNumbers = value.replace(/\D/g, "");
    setFormData((prev: LocalFormData) => ({
      ...prev,
      [field]: onlyNumbers,
    }));
  };

  const handleSalvarESair = () => {
    router.push("/");
  };

  const filledArea = formData.usableArea.length > 0;

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
            Nos conte mais sobre o imóvel
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
                  Etapa 1 de 4
                </span>
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[25%] bg-brand rounded-full"></div>
                </div>
              </div>

              <Button
                variant="outline"
                className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50"
                onClick={handleSalvarESair}
              >
                Salvar e sair
              </Button>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-12 pb-4">
              <section className="space-y-8">
                <div className="flex items-start justify-between gap-6 ">
                  <div>
                    <h3 className="text-xl font-semibold">Tipo de imóvel</h3>
                    <p className="text-slate-600 mt-1.5">
                      Escolha a finalidade do anúncio e a categoria.
                    </p>
                  </div>
                  <div className="w-[160px] h-11 shrink-0">
                    <Select
                      value={formData.transactionType}
                      onValueChange={(val) =>
                        setFormData((prev: LocalFormData) => ({
                          ...prev,
                          transactionType:
                            val as LocalFormData["transactionType"],
                        }))
                      }
                    >
                      <SelectTrigger className=" w-full  h-full border-slate-700 ">
                        <SelectValue placeholder="Finalidade" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        sideOffset={6}
                        className="z-50"
                      >
                        <SelectItem value="sell">Vender</SelectItem>
                        <SelectItem value="rent">Alugar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {propertyTypes.map((type) => {
                    const isActive = formData.propertyType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectPropertyType(type.id)}
                        className="focus:outline-none"
                      >
                        <Card
                          className={cn(
                            "p-5 flex flex-col items-center justify-center text-center gap-3 h-36 border-2 border-brand-white hover:border-brand-light transition-colors",
                            isActive &&
                              "border-brand bg-brand-white ring-2 ring-brand/40",
                          )}
                        >
                          <span
                            className={cn(
                              "transition-colors",
                              isActive ? "text-brand" : "text-slate-700",
                            )}
                          >
                            {type.icon}
                          </span>
                          <p className="text-sm font-medium whitespace-pre-line">
                            {type.name}
                          </p>
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </section>

              {formData.propertyType && (
                <>
                  <section className="space-y-6 pt-8 border-t border-slate-100">
                    <div>
                      <h3 className="flex items-center gap-2 text-xl font-semibold">
                        <SlidersHorizontal className="w-5 h-5" />
                        Detalhes do imóvel
                      </h3>
                      <p className="text-slate-600 mt-1.5">
                        Informe a quantidade de cada ambiente. Esses números
                        aparecem nos filtros de busca.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pb-6 border-b border-slate-100">
                      <CounterFieldItem
                        label="Quartos"
                        icon={<Bed className="w-5 h-5" />}
                        required
                        value={formData.bedrooms}
                        onDecrease={() => handleCounterChange("bedrooms", -1)}
                        onIncrease={() => handleCounterChange("bedrooms", 1)}
                      />
                      <CounterFieldItem
                        label="Banheiros"
                        icon={<ShowerHead className="w-5 h-5" />}
                        value={formData.bathrooms}
                        onDecrease={() => handleCounterChange("bathrooms", -1)}
                        onIncrease={() => handleCounterChange("bathrooms", 1)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                      <CounterFieldItem
                        label="Suítes"
                        icon={<Bed className="w-5 h-5" />}
                        info
                        disabled={formData.bedrooms === 0}
                        value={formData.suites}
                        onDecrease={() => handleCounterChange("suites", -1)}
                        onIncrease={() => handleCounterChange("suites", 1)}
                      />
                      <CounterFieldItem
                        label="Vagas de garagem"
                        icon={<Car className="w-5 h-5" />}
                        value={formData.garageSpaces}
                        onDecrease={() =>
                          handleCounterChange("garageSpaces", -1)
                        }
                        onIncrease={() =>
                          handleCounterChange("garageSpaces", 1)
                        }
                      />
                    </div>
                  </section>

                  <section className="space-y-6 pt-8 border-t border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="flex items-center gap-2 text-xl font-semibold">
                          <Ruler className="w-5 h-5" />
                          Áreas
                        </h3>
                        <p className="text-slate-600 mt-1.5">
                          As medidas em metros quadrados ajudam o comprador a
                          encontrar seu imóvel.
                        </p>
                      </div>
                      {filledArea && (
                        <span className="shrink-0 w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                          Área útil <span className="text-red-500">*</span>
                          <Info className="w-3.5 h-3.5 text-slate-400" />
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formData.usableArea}
                            onChange={(e) =>
                              handleAreaChange("usableArea", e.target.value)
                            }
                            className="w-full h-12 rounded-lg border border-slate-300 px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                            m²
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                          Área total
                          <Info className="w-3.5 h-3.5 text-slate-400" />
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formData.totalArea}
                            onChange={(e) =>
                              handleAreaChange("totalArea", e.target.value)
                            }
                            className="w-full h-12 rounded-lg border border-slate-300 px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                            m²
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>

          <footer className="mt-8 pt-8 border-t border-brand-white flex justify-between items-center shrink-0">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-slate-600 hover:bg-brand-white border border-slate-700 px-8 h-12 rounded-xl"
            >
              <Link href="/anuncie">
                <ArrowLeft className="w-5 h-5" /> Voltar
              </Link>
            </Button>
            <Button
              asChild
              className="bg-brand-dark text-brand-white px-8 h-12 rounded-xl gap-2 hover:bg-brand-light"
            >
              <Link href="/anuncie/register-info-hero">
                Continuar <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}

function CounterFieldItem({
  label,
  icon,
  value,
  onDecrease,
  onIncrease,
  required,
  info,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  required?: boolean;
  info?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={cn(
          "flex items-center gap-2 text-sm font-medium",
          disabled ? "text-slate-400" : "text-slate-900",
        )}
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
        {info && <Info className="w-3.5 h-3.5 text-slate-400" />}
      </span>
      <div
        className={cn(
          "flex items-center gap-4 bg-slate-50 rounded-lg h-11 px-2",
          disabled && "opacity-60",
        )}
      >
        <button
          type="button"
          onClick={onDecrease}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          disabled={disabled || value === 0}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span
          className={cn(
            "w-4 text-center font-medium",
            disabled ? "text-slate-400" : "text-slate-900",
          )}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          disabled={disabled}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
