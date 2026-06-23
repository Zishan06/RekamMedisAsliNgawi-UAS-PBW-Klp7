"use client";

/**
 * AuthGuard — Komponen pelindung rute terproteksi.
 * Jika belum login, redirect ke /login.
 * Jika sedang loading, tampilkan loading screen.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { useAuth } from "@/context/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading State — tampilkan saat mengecek session
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-page gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))" }}>
            <Activity size={28} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-earth-500 border-2 border-white animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-700">Memuat sistem...</p>
          <p className="text-xs text-neutral-400 mt-0.5">RME Ngawi — RSUD Ngawi</p>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-primary-600 border-t-transparent animate-spin mt-2" />
      </div>
    );
  }

  // Belum login — render null sambil redirect berlangsung
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
