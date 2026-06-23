"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  History,
  Stethoscope,
  HeartPulse,
  BarChart3,
  FileBarChart,
  Settings,
  ChevronDown,
  X,
  Activity,
  LogOut,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─────────────────────────────────────────────
   Navigation Data
───────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Pasien",
    icon: <Users size={20} />,
    children: [
      { label: "Daftar Pasien", href: "/pasien" },
      { label: "Tambah Pasien", href: "/pasien/tambah" },
    ],
  },
  {
    label: "Rekam Medis",
    icon: <ClipboardList size={20} />,
    children: [
      { label: "Kunjungan", href: "/rekam-medis/kunjungan" },
      { label: "Riwayat", href: "/rekam-medis/riwayat" },
    ],
  },
  {
    label: "Tenaga Medis",
    icon: <Stethoscope size={20} />,
    children: [
      { label: "Dokter", href: "/tenaga-medis/dokter" },
      { label: "Perawat", href: "/tenaga-medis/perawat" },
    ],
  },
  {
    label: "Laporan",
    icon: <BarChart3 size={20} />,
    children: [
      { label: "Statistik", href: "/laporan/statistik" },
      { label: "Evaluasi", href: "/laporan/evaluasi" },
    ],
  },
  {
    label: "Pengaturan",
    href: "/settings",
    icon: <Settings size={20} />,
  },
];

/* ─────────────────────────────────────────────
   Collapsible Nav Section
───────────────────────────────────────────── */
function NavSection({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
  const [isExpanded, setIsExpanded] = useState(isChildActive);

  const toggle = useCallback(() => setIsExpanded((p) => !p), []);

  // Direct link (no children)
  if (item.href) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        )}
      >
        <span className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isActive ? "text-white" : "text-neutral-400 group-hover:text-primary-500"
        )}>
          {item.icon}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  }

  // Collapsible section with children
  return (
    <div>
      <button
        onClick={toggle}
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all duration-200",
          isChildActive
            ? "bg-primary-50 text-primary-700"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        )}
      >
        <span className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isChildActive ? "text-primary-600" : "text-neutral-400 group-hover:text-primary-500"
        )}>
          {item.icon}
        </span>
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          size={16}
          className={cn(
            "transition-transform duration-300 text-neutral-400",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Children */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-5 pl-4 border-l-2 border-neutral-200 space-y-0.5">
          {item.children?.map((child) => {
            const isActive = pathname === child.href || pathname.startsWith(child.href + "/");
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "text-primary-700 font-semibold bg-primary-50"
                    : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                )}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sidebar Component
───────────────────────────────────────────── */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* ── Mobile Backdrop ──────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Sidebar Panel ────────────────────── */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full flex flex-col",
          "w-[var(--spacing-sidebar)] bg-surface-card border-r border-neutral-200",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        )}
      >
        {/* ── Brand Header ───────────────────── */}
        <div className="flex-shrink-0 px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-md shadow-primary-600/25">
                <Activity size={20} className="text-white" />
                {/* Terracotta accent dot */}
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-earth-500 border-2 border-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-neutral-900 leading-tight tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                  RME Ngawi
                </h1>
                <p className="text-2xs text-neutral-400 font-medium tracking-wider uppercase">
                  Asli Ngawi
                </p>
              </div>
            </div>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* ── Javanese accent divider ────────── */}
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-primary-200 via-earth-200 to-transparent" />
            {/* Small geometric Javanese motif — 3 diamond shapes */}
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rotate-45 bg-earth-300" />
              <div className="w-1.5 h-1.5 rotate-45 bg-primary-300" />
              <div className="w-1.5 h-1.5 rotate-45 bg-earth-300" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-primary-200 via-earth-200 to-transparent" />
          </div>
        </div>

        {/* ── Navigation ─────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 no-scrollbar">
          <p className="section-label px-3 mb-2">Menu Utama</p>
          {NAV_ITEMS.slice(0, 1).map((item) => (
            <NavSection key={item.label} item={item} pathname={pathname} />
          ))}

          <p className="section-label px-3 mt-5 mb-2">Manajemen</p>
          {NAV_ITEMS.slice(1, 4).map((item) => (
            <NavSection key={item.label} item={item} pathname={pathname} />
          ))}

          <p className="section-label px-3 mt-5 mb-2">Analitik</p>
          {NAV_ITEMS.slice(4, 5).map((item) => (
            <NavSection key={item.label} item={item} pathname={pathname} />
          ))}

          <p className="section-label px-3 mt-5 mb-2">Sistem</p>
          {NAV_ITEMS.slice(5).map((item) => (
            <NavSection key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* ── Footer ─────────────────────────── */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-dot" />
              <span className="text-2xs text-neutral-400 font-medium">
                Sistem Aktif
              </span>
            </div>
            <p className="text-2xs text-neutral-300 mt-1">
              v1.0.0 — RSUD Ngawi
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-danger hover:bg-danger-light/50 transition-colors"
            title="Keluar dari sistem"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
