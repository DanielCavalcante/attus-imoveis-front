"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function RegisterLocation() {
  const [formData, setFormData] = useState({
    cep: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = formData.cep.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              rua: data.logradouro,
              cidade: data.localidade,
              estado: data.uf,
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    };
    fetchAddress();
  }, [formData.cep]);

  return (
    <div className="min-h-screen flex flex-row font-sans">

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
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            Precisa de ajuda?
          </button>
          <span>© 2026 Encontrei</span>
        </div>
      </aside>

      <main className="flex-1 bg-brand-white p-10 md:p-16 flex flex-col">
        <div className="max-w-6xl w-full mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
          <header className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Etapa 2 de 3
                </span>
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[50%] bg-brand rounded-full"></div>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50"
              >
                Salvar e Sair
              </Button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto space-y-12 flex-grow">
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  Endereço
                </h2>
                <p className="text-slate-600 mt-1.5">
                  Informe os dados de localização para facilitar a busca.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value })
                    }
                    placeholder="01010-000"
                    className="border-slate-200 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rua</Label>
                  <Input
                    value={formData.rua}
                    readOnly
                    className="border-slate-200 h-12 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input placeholder="123" className="border-slate-200 h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.cidade}
                    readOnly
                    className="border-slate-200 h-12 bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input
                    value={formData.estado}
                    readOnly
                    className="border-slate-200 h-12 bg-slate-50"
                  />
                </div>
              </div>
            </section>
          </div>

         
          <footer className="mt-16 pt-8 border-t border-brand-white flex justify-between items-center">
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
              <Link href="/anuncie/register-image">
                Continuar <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}
