"use client";

/**
 * auth-context.tsx — React Context untuk Auth State Global
 * RME Ngawi
 *
 * Menyediakan:
 * - user: AuthUser | null
 * - isLoading: boolean
 * - login(credentials): Promise<AuthResult>
 * - logout(): void
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  type AuthUser,
  type LoginCredentials,
  type AuthResult,
  getSession,
  mockLogin,
  mockLogout,
} from "@/lib/auth";

/* ─────────────────────────────────────────────
   Context Shape
───────────────────────────────────────────── */

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => void;
}

/* ─────────────────────────────────────────────
   Context
───────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ─────────────────────────────────────────────
   Provider
───────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate dari localStorage saat mount
  useEffect(() => {
    const session = getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResult> => {
      const result = await mockLogin(credentials);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    },
    []
  );

  const logout = useCallback(() => {
    mockLogout();
    setUser(null);
    toast.success("Berhasil keluar dari sistem", {
      description: "Sampai jumpa! Tetap jaga kesehatan.",
      duration: 3000,
    });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   Hook
───────────────────────────────────────────── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return ctx;
}
