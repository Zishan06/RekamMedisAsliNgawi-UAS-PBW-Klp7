import type { Metadata } from "next";
import { PatientManagementView } from "@/components/patient";

export const metadata: Metadata = {
  title: "Manajemen Pasien — RME Ngawi",
  description:
    "Kelola data pasien, akses riwayat medis, dan pantau status kunjungan di RSUD Ngawi.",
};

/* ─────────────────────────────────────────────
   Pasien Page (Server Component)
   
   Layout (delegated to PatientManagementView):
   ┌────────────────────────────────────────┐
   │  Header + Tombol Tambah Pasien         │
   ├────────────────────────────────────────┤
   │  Stats Bar (4 mini cards)              │
   ├────────────────────────────────────────┤
   │  Search + Filter                       │
   ├────────────────────────────────────────┤
   │  [desktop]  Patient Table              │
   │  [mobile]   Patient Card List          │
   └────────────────────────────────────────┘
───────────────────────────────────────────── */
export default function PasienPage() {
  return <PatientManagementView />;
}
