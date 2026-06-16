"use client";

import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Empresa */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">
                Encontrei Imóveis
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Encontre o imóvel ideal para comprar, vender ou alugar de forma
              rápida e segura.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="mb-4 font-semibold">
              Navegação
            </h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary"
              >
                Home
              </Link>

              <Link
                href="/imoveis"
                className="text-muted-foreground hover:text-primary"
              >
                Imóveis
              </Link>

              <Link
                href="/anuncie"
                className="text-muted-foreground hover:text-primary"
              >
                Anunciar Imóvel
              </Link>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="mb-4 font-semibold">
              Institucional
            </h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/sobre"
                className="text-muted-foreground hover:text-primary"
              >
                Sobre Nós
              </Link>

              <Link
                href="/termos"
                className="text-muted-foreground hover:text-primary"
              >
                Termos de Uso
              </Link>

              <Link
                href="/privacidade"
                className="text-muted-foreground hover:text-primary"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 font-semibold">
              Contato
            </h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(83) 99999-9999</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@encontrei.com.br</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>João Pessoa - PB</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="rounded-xl border p-6 mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Está vendendo ou alugando?
              </h3>
              <p className="text-muted-foreground">
                Anuncie gratuitamente e alcance milhares de pessoas.
              </p>
            </div>

            <Button>
              Anunciar Imóvel
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} Encontrei Imóveis. Todos os direitos
            reservados.
          </p>

          <div className="flex gap-4">
            <Link
              href="#"
              className="hover:text-primary"
            >
              Instagram
            </Link>

            <Link
              href="#"
              className="hover:text-primary"
            >
              Facebook
            </Link>

            <Link
              href="#"
              className="hover:text-primary"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}