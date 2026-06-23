import type { Metadata } from "next";
import { EvaluasiView } from "@/components/staff";

export const metadata: Metadata = {
  title: "Evaluasi Tenaga Medis",
  description: "Pantau performa dokter dan tenaga kesehatan RSUD Ngawi.",
};

export default function EvaluasiPage() {
  return <EvaluasiView />;
}
