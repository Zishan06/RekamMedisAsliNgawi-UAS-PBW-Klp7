import type { Metadata } from "next";
import {
  WelcomeHeader,
  StatsGrid,
  KunjunganChart,
  AktivitasTerbaru,
  QuickActions,
  RingkasanOperasional,
  STAT_CARDS,
  KUNJUNGAN_7_HARI,
  AKTIVITAS_TERBARU,
  RINGKASAN_OPERASIONAL,
} from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

/* ─────────────────────────────────────────────
   Dashboard Page
   
   Layout (desktop):
   ┌────────────────────────────────────────┐
   │         Welcome Header                 │
   ├────────────────────────────────────────┤
   │  Stat  │  Stat  │  Stat  │  Stat      │
   ├──────────────────────┬─────────────────┤
   │                      │  Quick Actions  │
   │   Kunjungan Chart    ├─────────────────┤
   │                      │  Ringkasan Ops  │
   ├──────────────────────┴─────────────────┤
   │          Aktivitas Terbaru             │
   └────────────────────────────────────────┘
───────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* SECTION 1 — Welcome */}
      <WelcomeHeader />

      {/* SECTION 2 — Stats */}
      <StatsGrid cards={STAT_CARDS} />

      {/* SECTION 3+4+5+6 — Chart, Aktivitas, Quick Actions, Ringkasan */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column — Chart + Aktivitas (same width, col-span-2) */}
        <div className="xl:col-span-2 space-y-6">
          <KunjunganChart data={KUNJUNGAN_7_HARI} />
          <AktivitasTerbaru items={AKTIVITAS_TERBARU} />
        </div>

        {/* Right column — Quick Actions + Ringkasan */}
        <div className="space-y-6">
          <QuickActions />
          <RingkasanOperasional items={RINGKASAN_OPERASIONAL} />
        </div>
      </div>
    </div>
  );
}
