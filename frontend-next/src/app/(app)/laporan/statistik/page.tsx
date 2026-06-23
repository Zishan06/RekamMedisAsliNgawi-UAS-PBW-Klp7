import type { Metadata } from "next";
import { StatistikView } from "@/components/analytics";

export const metadata: Metadata = {
  title: "Statistik & Analitik",
  description: "Dashboard statistik dan analitik performa rumah sakit RSUD Ngawi.",
};

export default function StatistikPage() {
  return <StatistikView />;
}
