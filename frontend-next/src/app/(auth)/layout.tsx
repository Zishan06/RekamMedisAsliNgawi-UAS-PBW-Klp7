import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — RME Ngawi",
  description: "Login ke Sistem Rekam Medis Elektronik RSUD Ngawi",
};

/**
 * Layout untuk halaman autentikasi (login, dll).
 * Tidak menggunakan AppShell — tampilan full-screen tanpa sidebar/topbar.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
