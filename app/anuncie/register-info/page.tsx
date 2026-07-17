"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const propertyTypes = [
  { id: "apartamento", name: "Apartamento", icon: "🏢" },
  { id: "casas-sobrados", name: "Casas &\nSobrados", icon: "🏠" },
  { id: "condominio", name: "Casa em\ncondomínio", icon: "🏘️" },
  { id: "kitnets-studios", name: "Kitnets &\nStúdios", icon: "🏢" },
];

export default function CadastroImovelPage() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipoTransacao: "",
    tipoImovel: null as string | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPropertyType = (id: string) => {
    setFormData((prev) => ({ ...prev, tipoImovel: id }));
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

      <main className="flex-1 bg-brand-white p-10 md:p-16 flex flex-col">
        <div className="max-w-6xl w-full mx-auto">
          <header className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Etapa 1 de 3
                </span>
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[25%] bg-brand rounded-full"></div>
                </div>
              </div>

              <Button
                variant="outline"
                className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50"
              >
                Salvar e sair
              </Button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto space-y-12 flex-grow">
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Informações principais
                </h2>
                <p className="text-slate-600 mt-1.5">
                  Dados principais do imóvel.
                </p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do anúncio</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    placeholder="Ex: Apartamento 3 quartos no centro"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="border-slate-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descreva os detalhes do imóvel..."
                    rows={7}
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="border-slate-200 p-4"
                  />
                </div>
              </div>
            </section>

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
                    value={formData.tipoTransacao}
                    onValueChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        tipoTransacao: val,
                      }))
                    }
                  >
                    <SelectTrigger       className=" w-full  h-full border-slate-700 "
                    >
                      <SelectValue placeholder="Finalidade" />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      className="z-50"
                    >
                      <SelectItem value="vender">Vender</SelectItem>
                      <SelectItem value="alugar">Alugar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleSelectPropertyType(type.id)}
                    className="focus:outline-none"
                  >
                    <Card
                      className={cn(
                        "p-5 flex flex-col items-center justify-center text-center gap-3 h-36 border-brand-white hover:border-brand-light",
                        formData.tipoImovel === type.id
                          ? "border-brand bg-brand-white"
                          : "",
                      )}
                    >
                      <span className="text-3xl">{type.icon}</span>
                      <p className="text-sm font-medium whitespace-pre-line">
                        {type.name}
                      </p>
                    </Card>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-brand-white flex justify-between items-center">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-slate-600 hover:bg-brand-white border border-slate-700 px-8 h-12 rounded-xl"
            >
              <Link href="/anuncie">
                <ArrowLeft className="w-5 h-5" /> Voltar
              </Link>
            </Button>
            <Button asChild className="bg-brand-dark text-brand-white px-8 h-12 rounded-xl gap-2 hover:bg-brand-light">
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
