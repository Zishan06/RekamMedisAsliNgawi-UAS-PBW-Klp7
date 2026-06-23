import { AppShell } from "@/components/layout";
import { PatientStoreProvider } from "@/lib/patient-store";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { NotificationProvider } from "@/context/notification-context";

/**
 * Layout untuk halaman dashboard, settings, dan profile.
 *
 * Semua route di dalam folder ini otomatis mendapatkan
 * Sidebar + Topbar dari AppShell, serta PatientStoreProvider
 * dan NotificationProvider.
 */
export default function DashboardLayout({
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
