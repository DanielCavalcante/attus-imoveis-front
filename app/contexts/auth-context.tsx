"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  decodeSession,
  mergeProfileIntoSession,
  type SessionUser,
} from "../lib/session";

type User = SessionUser;

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (token: string) => void;
  logout: () => void;
  updateUserSession: (user: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function login(token: string) {
    localStorage.setItem("token", token);

    setToken(token);
    setUser(decodeSession(token));
  }

  function logout() {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  }

  /**
   * Só os campos de exibição mudam. Identidade — id, e-mail, tipo e papel —
   * continua vindo do token; ver `app/lib/session.ts`.
   */
  function updateUserSession(profile: Partial<User>) {
    setUser((atual) => mergeProfileIntoSession(atual, profile));
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    // Resquício da versão anterior, que mantinha uma cópia da sessão com
    // precedência sobre o token. Removido para não voltar a ser lido.
    localStorage.removeItem("user");

    setToken(storedToken);
    setUser(decodeSession(storedToken));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
