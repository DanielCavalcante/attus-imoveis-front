"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, ChevronRight, ArrowLeft } from "lucide-react";

export default function RegisterImage() {
  const [fotos, setFotos] = useState<File[]>([]);

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
            Insira fotos e vídeo do seu imóvel
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
                  Etapa 3 de 3
                </span>
              
                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-brand rounded-full"></div>
                </div>
              </div>
              <Button variant="outline" className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50">
                Salvar e Sair
              </Button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto flex-grow space-y-12">
           
            <div className="flex bg-slate-100 p-1 rounded-lg w-48">
              <button className="flex-1 py-1.5 bg-brand-white shadow rounded text-sm font-medium">
                Fotos {fotos.length}/30
              </button>
              <button className="flex-1 py-1.5 text-slate-500 text-sm">Vídeo</button>
            </div>

            <div className="border-2 border-dashed border-slate-400 rounded-xl p-12 flex flex-col items-center justify-center text-center text-slate-500 hover:border-brand transition-colors cursor-pointer h-64">
              <Upload className="w-8 h-8 mb-4 text-slate-400" />
              <p>Arraste aqui ou carregue da galeria.</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-brand-dark">
                BOAS PRÁTICAS
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>1. Fotos na horizontal</li>
                <li>2. Luz natural, sem flash</li>
                <li>3. Mostre todos os cômodos</li>
                <li>4. Inclua a fachada</li>
              </ul>
            </div>
          </div>

          <footer className="mt-16 pt-8 border-t border-brand-white flex justify-between items-center">
            <Button asChild variant="ghost" className="gap-2 text-slate-600 hover:bg-brand-white border border-slate-700 px-8 h-12 rounded-xl">
              <Link href="/anuncie/register-location">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Link>
            </Button>
            <Button asChild className="bg-brand-dark text-brand-white px-8 h-12 rounded-xl gap-2 hover:bg-brand-light">
              <Link href="/anuncie/local-user">
                Finalizar o Anúncio <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}