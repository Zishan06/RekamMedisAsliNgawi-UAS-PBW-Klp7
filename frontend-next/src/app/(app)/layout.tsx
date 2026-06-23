import { AppShell } from "@/components/layout";
import { PatientStoreProvider } from "@/lib/patient-store";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { NotificationProvider } from "@/context/notification-context";

/**
 * Layout untuk semua halaman yang menggunakan AppShell.
 * Route group (app) — URL tetap bersih tanpa prefix /app.
 *
 * Semua route di dalam folder ini akan otomatis mendapatkan
 * Sidebar + Topbar dari AppShell, serta PatientStoreProvider
 * yang menyimpan mock state pasien secara global.
 *
 * AuthGuard memastikan hanya user yang sudah login yang bisa
 * mengakses halaman-halaman ini.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <PatientStoreProvider>
        <NotificationProvider>
          <AppShell>{children}</AppShell>
        </NotificationProvider>
      </PatientStoreProvider>
    </AuthGuard>
  );
}
