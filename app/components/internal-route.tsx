"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";

import { useAuth } from "../contexts/auth-context";

type Props = {
  children: ReactNode;
};

/**
 * Guard por papel para o painel interno.
 *
 * Isto NÃO é o que protege os dados: `/api/v1/backoffice/**` exige papel
 * INTERNO no servidor. Aqui só evitamos desenhar uma tela que vai receber 403
 * em toda chamada. Nenhuma regra ou dado sensível pode depender deste arquivo.
 */
export function InternalRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">Carregando...</div>
    );
  }

  if (!user) {
    return null;
  }

  // Quem tem conta e errou de endereço precisa entender o que houve, em vez de
  // ser jogado para o login sem explicação.
  if (user.role !== "INTERNO") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShieldOff className="h-10 w-10 text-muted-foreground" aria-hidden />
        </div>

        <h1 className="mt-8 text-3xl font-bold">Área restrita</h1>

        <p className="mt-3 max-w-md text-muted-foreground">
          Esta área é da equipe interna. Sua conta não tem esse acesso.
        </p>
      </div>
    );
  }

  return children;
}
