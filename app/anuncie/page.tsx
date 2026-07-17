"use client";


import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Users, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  text: string;
}

function FeatureCard({ icon, text }: FeatureCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 px-6 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-white text-brand-dark">
          {icon}
        </div>
        <p className="text-sm leading-snug text-brand">{text}</p>
      </CardContent>
    </Card>
  );
}

export default function PropertyRegistrationHero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
       
        <div className="order-2 flex justify-center lg:order-1">
          <div className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
            
            <Image
              src="/images/mulher-encontrei.png"
              alt=""
             fill
             sizes="400px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Badge
            variant="secondary"
            className="gap-2 rounded-full bg-brand-white px-4 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Planos em até 6x de R$ 41,65
          </Badge>

          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
            Venda ou alugue seus imóveis de forma{" "}
            <span className="text-brand-dark">rápida e descomplicada</span>
          </h1>

          <p className="mt-4 max-w-md text-base text-gray-500 sm:text-lg">
            Cadastre seu imóvel em minutos. Receba contatos direto no
            WhatsApp.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-dark font-semibold hover:bg-brand"
            >
              <Link href="/cadastro?intencao=venda">Vou vender</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-brand-dark font-semibold hover:bg-brand"
            >
              <Link href="/anuncie/register-info">Vou alugar</Link>
            </Button>
          </div>

          <Link
            href="/cadastro/profissional"
            className="mt-4 inline-block text-sm text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline"
          >
            Sou profissional (PJ) →
          </Link>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={<Users className="h-6 w-6" />}
          text="+ de 15 milhões de visitas mensais"
        />
        <FeatureCard
          icon={<MessageCircle className="h-6 w-6" />}
          text='Receba mensagens e agendamentos por WhatsApp e e-mail'
        />
        <FeatureCard
          icon={<Star className="h-6 w-6" />}
          text='Selo destaque "Direto com o proprietário" no seu anúncio'
        />
      </div>
    </section>
  );
}
