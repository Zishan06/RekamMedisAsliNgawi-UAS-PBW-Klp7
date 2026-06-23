"use client";

import { motion } from "framer-motion";
import { UserPlus, FilePlus, Search, BarChart3 } from "lucide-react";
import { cn } from "@/lib/cn";

/* ─────────────────────────────────────────────
   Quick Action Items
───────────────────────────────────────────── */
const ACTIONS = [
  {
    id: "tambah-pasien",
    label: "Tambah Pasien",
    description: "Daftarkan pasien baru",
    icon: UserPlus,
    color: "var(--color-primary-600)",
    bg: "var(--color-primary-50)",
    hoverBg: "var(--color-primary-100)",
    href: "/pasien/tambah",
  },
  {
    id: "rekam-medis",
    label: "Buat Rekam Medis",
    description: "Catat kunjungan pasien",
    icon: FilePlus,
    color: "var(--color-earth-600)",
    bg: "var(--color-earth-50)",
    hoverBg: "var(--color-earth-100)",
    href: "/rekam-medis/kunjungan",
  },
  {
    id: "cari-pasien",
    label: "Cari Pasien",
    description: "Temukan data pasien",
    icon: Search,
    color: "var(--color-success)",
    bg: "var(--color-success-light)",
    hoverBg: "#a7f3d0",
    href: "/pasien",
  },
  {
    id: "laporan",
    label: "Lihat Laporan",
    description: "Statistik & evaluasi",
    icon: BarChart3,
    color: "#7c3aed",
    bg: "#ede9fe",
    hoverBg: "#ddd6fe",
    href: "/laporan/statistik",
  },
];

/* ─────────────────────────────────────────────
   Quick Actions Component
───────────────────────────────────────────── */
export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl bg-surface-card border border-neutral-200 p-6 shadow-[0_2px_8px_0_rgb(0_0_0/0.05)]"
    >
      <div className="mb-5 relative">
        <div 
          className="absolute -left-4 -top-4 w-20 h-20 pointer-events-none opacity-[0.03]"
          style={{ 
            backgroundImage: "url('/patterns/gemini-pattern.svg')", 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10">
          <h2
            className="text-base font-bold text-neutral-900"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Aksi Cepat
          </h2>
          <div className="flex items-center gap-1.5 mt-1 mb-1.5 opacity-80">
            <span className="text-[10px] leading-none text-primary-600">◇</span>
            <div className="h-[1px] w-12 bg-neutral-200" />
          </div>
          <p className="text-xs text-neutral-400">Shortcut fitur utama</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.35 + index * 0.06 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-start gap-3 p-4 rounded-xl",
                "border border-neutral-100 transition-all duration-200",
                "hover:border-neutral-200 hover:shadow-sm text-left w-full"
              )}
              style={{ background: action.bg }}
              onClick={() => {
                // Routing akan diimplementasi saat halaman fitur dibuat
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.7)" }}
              >
                <Icon size={18} style={{ color: action.color }} />
              </div>
              <div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: action.color }}
                >
                  {action.label}
                </p>
                <p className="text-2xs text-neutral-500 mt-0.5">
                  {action.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
