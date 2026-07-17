"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-row font-sans bg-brand-white">
  
      <aside className="w-[400px] bg-slate-950 p-12 text-brand-white flex flex-col justify-between flex-shrink-0">
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
            Olá User, <br />
            continue de onde parou.
          </h1>
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <button className="flex items-center gap-2 hover:text-brand-white transition-colors">
            Precisa de ajuda?
          </button>
          <span>© 2026 Chaves na Mão</span>
        </div>
      </aside>

      <main className="flex-1 p-16">
        <header className="flex justify-end mb-12">
          <Button variant="outline" className="rounded-full px-6 border-slate-700">
            <Link href="/anuncie">Sair</Link>
           
          </Button>
        </header>

        <div className="max-w-3xl mx-auto space-y-6">

          <div className="border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Apartamento, Bessa</h3>
              <p className="text-sm text-slate-600">1 quartos · 110 m² · Aluguel</p>
              <p className="text-xs text-slate-400 mt-1">Editado recentemente · 88%</p>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Faltam: Dados do anunciante</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[88%] bg-brand rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button className="p-2 text-slate-400 hover:text-brand transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <Link href="/anuncie/register-info" className="p-2 text-brand hover:text-brand-dark transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-14 border-2 border-dashed border-brand-light text-brand-light hover:bg-brand hover:text-brand-white rounded-xl font-medium"
          >
            <Plus className="w-5 h-5 mr-2" /> Novo anúncio
          </Button>
        </div>
      </main>
    </div>
  );
}