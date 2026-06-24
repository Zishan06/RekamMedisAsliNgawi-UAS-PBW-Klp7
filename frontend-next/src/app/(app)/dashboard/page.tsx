"use client";

/**
 * Dashboard Page
 *
 * Mengambil data real dari backend:
 * - GET /api/pasien      → stat cards (total, aktif, rawat inap)
 * - GET /api/rekam-medis → aktivitas terbaru
 * - GET /api/dokter      → jumlah dokter bertugas
 */

import { useEffect, useState } from "react";
import {
  WelcomeHeader,
  StatsGrid,
  KunjunganChart,
  AktivitasTerbaru,
  QuickActions,
  RingkasanOperasional,
  KUNJUNGAN_7_HARI,
  RINGKASAN_OPERASIONAL,
} from "@/components/dashboard";
import type { StatCard, Aktivitas } from "@/components/dashboard/data";
import {
  pasienApi,
  dokterApi,
  rekamMedisApi,
  type BackendPasien,
  type BackendRekamMedis,
} from "@/lib/api";
import { Loader2, ServerCrash } from "lucide-react";

/* ─────────────────────────────────────────────
   Helper — Buat StatCard dari data real
───────────────────────────────────────────── */
function buildStatCards(
  pasienList: BackendPasien[],
  jumlahDokter: number
): StatCard[] {
  const totalPasien = pasienList.length;
  const pasienAktif = pasienList.filter(
    (p) => p.status === "Aktif" || p.status === "Rawat Jalan"
  ).length;
  const rawatInap = pasienList.filter((p) => p.status === "Rawat Inap").length;

  return [
    {
      id: "total-pasien",
      label: "Total Pasien",
      value: totalPasien,
      trend: 0,
      trendLabel: "data real dari database",
      color: "var(--color-primary-600)",
      bgColor: "var(--color-primary-50)",
      iconName: "users",
    },
    {
      id: "kunjungan-hari-ini",
      label: "Pasien Aktif",
      value: pasienAktif,
      trend: 0,
      trendLabel: "aktif & rawat jalan",
      color: "var(--color-success)",
      bgColor: "var(--color-success-light)",
      iconName: "calendar-check",
    },
    {
      id: "antrian-aktif",
      label: "Rawat Inap",
      value: rawatInap,
      trend: 0,
      trendLabel: "sedang dirawat inap",
      color: "var(--color-warning)",
      bgColor: "var(--color-warning-light)",
      iconName: "clock",
    },
    {
      id: "dokter-bertugas",
      label: "Dokter Terdaftar",
      value: jumlahDokter,
      trend: 0,
      trendLabel: "data real dari database",
      color: "var(--color-earth-500)",
      bgColor: "var(--color-earth-100)",
      iconName: "stethoscope",
    },
  ];
}

/* ─────────────────────────────────────────────
   Helper — Map rekam medis → Aktivitas
───────────────────────────────────────────── */
const AKTIVITAS_ICONS: Record<string, Aktivitas["type"]> = {
  "Rawat Inap": "pasien-baru",
  "Selesai": "rekam-medis",
};

function buildAktivitas(riwayat: BackendRekamMedis[]): Aktivitas[] {
  // Ambil 6 rekam medis terbaru berdasarkan tanggal
  const sorted = [...riwayat].sort((a, b) =>
    b.tanggal.localeCompare(a.tanggal)
  );
  return sorted.slice(0, 6).map((rm, i) => {
    const tglFormatted = new Date(rm.tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return {
      id: String(rm.id),
      type: AKTIVITAS_ICONS[rm.status] ?? "rekam-medis",
      deskripsi: `Rekam medis — ${rm.poli}`,
      subjek: rm.diagnosa || rm.poli,
      waktu: tglFormatted,
      timestamp: rm.tanggal,
      aktor: `${rm.poli}`,
    };
  });
}

/* ─────────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome placeholder */}
      <div className="h-20 bg-neutral-100 rounded-2xl" />
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-36 bg-neutral-100 rounded-2xl" />
        ))}
      </div>
      {/* Chart area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-64 bg-neutral-100 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-28 bg-neutral-100 rounded-2xl" />
          <div className="h-28 bg-neutral-100 rounded-2xl" />
        </div>
      </div>
      <div className="h-48 bg-neutral-100 rounded-2xl" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
function DashboardError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-danger-light flex items-center justify-center">
        <ServerCrash size={32} className="text-danger" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-neutral-800">
          Gagal Memuat Data Dashboard
        </h2>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm">{message}</p>
        <p className="text-xs text-neutral-400 mt-1">
          Pastikan backend berjalan di{" "}
          <code className="bg-neutral-100 px-1 rounded">localhost:8080</code>
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
        }}
      >
        Coba Lagi
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Dashboard Page
───────────────────────────────────────────── */
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statCards, setStatCards] = useState<StatCard[]>([]);
  const [aktivitas, setAktivitas] = useState<Aktivitas[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [pasienList, dokterList, rekamMedisList] = await Promise.all([
          pasienApi.getAll(),
          dokterApi.getAll(),
          rekamMedisApi.getAll(),
        ]);

        if (cancelled) return;

        setStatCards(buildStatCards(pasienList, dokterList.length));
        setAktivitas(buildAktivitas(rekamMedisList));
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboardData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} />;

  return (
    <div className="space-y-6">
      {/* SECTION 1 — Welcome */}
      <WelcomeHeader />

      {/* SECTION 2 — Stats (data real) */}
      <StatsGrid cards={statCards} />

      {/* SECTION 3+4+5+6 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart tetap pakai data dummy — tidak ada endpoint historis */}
          <KunjunganChart data={KUNJUNGAN_7_HARI} />
          <AktivitasTerbaru
            items={
              aktivitas.length > 0
                ? aktivitas
                : []
            }
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <QuickActions />
          <RingkasanOperasional items={RINGKASAN_OPERASIONAL} />
        </div>
      </div>
    </div>
  );
}
