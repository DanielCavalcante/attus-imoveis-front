"use client";

import { useAuth } from "../contexts/auth-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export function PrivateRoute({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/portal/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
