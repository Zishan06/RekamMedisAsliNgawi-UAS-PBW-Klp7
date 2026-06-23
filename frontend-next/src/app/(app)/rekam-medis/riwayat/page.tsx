import type { Metadata } from "next";
import { RiwayatView } from "@/components/rekam-medis";

export const metadata: Metadata = {
  title: "Riwayat Rekam Medis",
  description: "Telusuri seluruh riwayat rekam medis pasien RSUD Ngawi.",
};

export default function RiwayatPage() {
  return <RiwayatView />;
}
