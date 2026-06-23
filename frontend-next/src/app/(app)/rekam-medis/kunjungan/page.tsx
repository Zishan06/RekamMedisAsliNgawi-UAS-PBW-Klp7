import type { Metadata } from "next";
import { KunjunganView } from "@/components/rekam-medis";

export const metadata: Metadata = {
  title: "Kunjungan Pasien",
  description: "Pantau aktivitas kunjungan dan pelayanan pasien hari ini di RSUD Ngawi.",
};

export default function KunjunganPage() {
  return <KunjunganView />;
}
