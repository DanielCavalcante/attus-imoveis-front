"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: number;
  email: string;
  fullname: string;
  photo: string;
  phone: string;
};

type Props = {
  children: ReactNode;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (token: string) => void;
  logout: () => void;
  updateUserSession: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function login(token: string) {
    const decoded = jwtDecode<User>(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(decoded));

    setToken(token);
    setUser(decoded);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  function updateUserSession(updatedUser: User) {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
      }
    } else if (storedToken) {
      const decoded = jwtDecode<User>(storedToken);
      setUser(decoded);
      localStorage.setItem("user", JSON.stringify(decoded));
    }

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
