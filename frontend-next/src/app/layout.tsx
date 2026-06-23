import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import "./globals.css";

/* ─────────────────────────────────────────────
   Metadata & SEO
───────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Rekam Medis Elektronik — RSUD Ngawi",
    template: "%s | RME Ngawi",
  },
  description:
    "Sistem Rekam Medis Elektronik modern untuk RSUD Ngawi. Kelola data pasien, catatan medis, dan diagnosis secara efisien dan aman.",
  keywords: [
    "rekam medis elektronik",
    "RSUD Ngawi",
    "sistem informasi rumah sakit",
    "EMR",
    "kesehatan digital",
  ],
  authors: [{ name: "Tim Pengembang RME Ngawi" }],
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

/* ─────────────────────────────────────────────
   Root Layout
───────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Google Fonts — loaded via link to avoid CSS @import order issues with Tailwind v4 PostCSS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300..700;1,14..32,300..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
            },
          }}
        />
      </body>
    </html>
  );
}

