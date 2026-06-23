"use client";

/**
 * notifikasi/page.tsx — Halaman Pusat Notifikasi penuh
 *
 * Fitur:
 * - Filter: Semua / Belum Dibaca / per Kategori
 * - Mark as read per item
 * - Mark all as read
 * - Clear all
 * - Empty state per filter
 * - Detail notifikasi lengkap dengan timestamp absolut
 * - Category chips filter
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Bell,
  Check,
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Trash2,
  BellOff,
  Users,
  ClipboardList,
  Calendar,
  Star,
  Activity,
  Settings,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotifications } from "@/context/notification-context";
import {
  NotificationItem,
  NotificationType,
  NotificationCategory,
} from "@/lib/dummy-notifications";

/* ─────────────────────────────────────────────
   Config
───────────────────────────────────────────── */
const CATEGORY_CONFIG: Record<
  NotificationCategory,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  pasien: {
    label: "Pasien",
    icon: <Users size={14} />,
    color: "text-primary-700",
    bg: "bg-primary-100",
  },
  "rekam-medis": {
    label: "Rekam Medis",
    icon: <ClipboardList size={14} />,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  jadwal: {
    label: "Jadwal",
    icon: <Calendar size={14} />,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  evaluasi: {
    label: "Evaluasi",
    icon: <Star size={14} />,
    color: "text-purple-700",
    bg: "bg-purple-100",
  },
  kunjungan: {
    label: "Kunjungan",
    icon: <Activity size={14} />,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  sistem: {
    label: "Sistem",
    icon: <Settings size={14} />,
    color: "text-neutral-700",
    bg: "bg-neutral-100",
  },
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getTypeIcon(type: NotificationType, size = "w-10 h-10") {
  switch (type) {
    case "info":
      return (
        <div className={cn(size, "rounded-xl bg-blue-100 flex items-center justify-center text-blue-600")}>
          <Info size={20} />
        </div>
      );
    case "success":
      return (
        <div className={cn(size, "rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600")}>
          <CheckCircle2 size={20} />
        </div>
      );
    case "warning":
      return (
        <div className={cn(size, "rounded-xl bg-amber-100 flex items-center justify-center text-amber-600")}>
          <AlertTriangle size={20} />
        </div>
      );
    case "alert":
      return (
        <div className={cn(size, "rounded-xl bg-red-100 flex items-center justify-center text-red-600")}>
          <AlertCircle size={20} />
        </div>
      );
  }
}

function getDateLabel(timestamp: string): string {
  const d = new Date(timestamp);
  if (isToday(d)) return "Hari Ini";
  if (isYesterday(d)) return "Kemarin";
  return format(d, "EEEE, d MMMM yyyy", { locale: localeId });
}

/* ─────────────────────────────────────────────
   Category Filter Chip
───────────────────────────────────────────── */
function CategoryChip({
  category,
  isActive,
  count,
  onClick,
}: {
  category: NotificationCategory | "all" | "unread";
  isActive: boolean;
  count: number;
  onClick: () => void;
}) {
  const isSpecial = category === "all" || category === "unread";

  if (category === "all") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150",
          isActive
            ? "bg-primary-600 text-white shadow-sm"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        )}
      >
        <Bell size={12} />
        Semua
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full text-2xs font-bold",
            isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-500"
          )}
        >
          {count}
        </span>
      </button>
    );
  }

  if (category === "unread") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150",
          isActive
            ? "bg-danger text-white shadow-sm"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        )}
      >
        <div className="w-2 h-2 rounded-full bg-current" />
        Belum Dibaca
        {count > 0 && (
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-full text-2xs font-bold",
              isActive ? "bg-white/20 text-white" : "bg-danger-light text-danger"
            )}
          >
            {count}
          </span>
        )}
      </button>
    );
  }

  const conf = CATEGORY_CONFIG[category as NotificationCategory];
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150",
        isActive
          ? cn(conf.bg, conf.color, "ring-1 ring-inset ring-current/30")
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      )}
    >
      {conf.icon}
      {conf.label}
      {count > 0 && (
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full text-2xs font-bold",
            isActive ? "bg-black/10 text-inherit" : "bg-neutral-200 text-neutral-500"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification Row
───────────────────────────────────────────── */
function NotifRow({
  notif,
  onMarkRead,
}: {
  notif: NotificationItem;
  onMarkRead: (id: string) => void;
}) {
  const conf = CATEGORY_CONFIG[notif.category];

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-5 transition-colors group",
        notif.isRead
          ? "bg-white hover:bg-neutral-50/80"
          : "bg-primary-50/30 hover:bg-primary-50/50"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 relative">
        {getTypeIcon(notif.type)}
        {/* Category badge */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
            conf.bg
          )}
        >
          <span className={conf.color}>{conf.icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p
            className={cn(
              "text-sm leading-snug",
              notif.isRead
                ? "font-semibold text-neutral-700"
                : "font-extrabold text-neutral-900"
            )}
          >
            {notif.title}
          </p>
          {!notif.isRead && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-2xs font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Baru
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold",
              conf.bg,
              conf.color
            )}
          >
            {conf.icon}
            {conf.label}
          </span>
        </div>

        {/* Summary */}
        <p
          className={cn(
            "text-sm leading-relaxed",
            notif.isRead ? "text-neutral-500" : "text-neutral-700"
          )}
        >
          {notif.summary}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          {/* Relative time */}
          <span className="text-xs text-neutral-400 font-medium">
            {formatDistanceToNow(new Date(notif.timestamp), {
              addSuffix: true,
              locale: localeId,
            })}
          </span>

          {/* Absolute time */}
          <span className="text-xs text-neutral-300 hidden sm:inline">
            {format(new Date(notif.timestamp), "dd MMM yyyy, HH:mm", { locale: localeId })}
          </span>

          {/* Actor */}
          {notif.actor && (
            <>
              <span className="text-xs text-neutral-300">•</span>
              <span className="text-xs text-neutral-400">{notif.actor}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0 self-start pt-0.5">
        {!notif.isRead && (
          <button
            onClick={() => onMarkRead(notif.id)}
            className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-all bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg"
          >
            Tandai Dibaca
          </button>
        )}
        {notif.href && (
          <Link
            href={notif.href}
            onClick={() => onMarkRead(notif.id)}
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            title="Buka halaman terkait"
          >
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page Component
───────────────────────────────────────────── */
type FilterType = "all" | "unread" | NotificationCategory;

export default function NotificationPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();
  const [filter, setFilter] = useState<FilterType>("all");

  // Filtered & sorted
  const filteredNotifs = useMemo(() => {
    let result = [...notifications];
    if (filter === "unread") {
      result = result.filter((n) => !n.isRead);
    } else if (filter !== "all") {
      result = result.filter((n) => n.category === filter);
    }
    return result.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [notifications, filter]);

  // Group by date label
  const groupedByDate = useMemo(() => {
    const groups: { label: string; items: NotificationItem[] }[] = [];
    filteredNotifs.forEach((n) => {
      const label = getDateLabel(n.timestamp);
      const existing = groups.find((g) => g.label === label);
      if (existing) existing.items.push(n);
      else groups.push({ label, items: [n] });
    });
    return groups;
  }, [filteredNotifs]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notifications.length, unread: unreadCount };
    (Object.keys(CATEGORY_CONFIG) as NotificationCategory[]).forEach((cat) => {
      counts[cat] = notifications.filter((n) => n.category === cat).length;
    });
    return counts;
  }, [notifications, unreadCount]);

  const categories = Object.keys(CATEGORY_CONFIG) as NotificationCategory[];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Page Header ─────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Bell size={20} className="text-white" />
            </div>
            <h1
              className="text-2xl font-extrabold text-neutral-900 leading-tight"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Pusat Notifikasi
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Pemberitahuan terkait rekam medis, jadwal, dan sistem RSUD Ngawi.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
            >
              <Check size={16} />
              Tandai Semua Dibaca
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-danger bg-danger-light hover:bg-red-200 transition-colors"
            >
              <Trash2 size={16} />
              Bersihkan
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Row ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: notifications.length, color: "text-neutral-700", bg: "bg-neutral-50 border-neutral-200" },
          { label: "Belum Dibaca", value: unreadCount, color: "text-danger", bg: "bg-danger-light border-red-200" },
          { label: "Sudah Dibaca", value: notifications.length - unreadCount, color: "text-success", bg: "bg-success-light border-green-200" },
          { label: "Kategori", value: Object.keys(CATEGORY_CONFIG).filter(c => notifications.some(n => n.category === c)).length, color: "text-primary-700", bg: "bg-primary-50 border-primary-200" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-xl p-3 border flex flex-col", stat.bg)}>
            <span className="text-2xs text-neutral-500 font-semibold uppercase tracking-wide">{stat.label}</span>
            <span className={cn("text-2xl font-extrabold mt-1 leading-none", stat.color)} style={{ fontFamily: "var(--font-sans)" }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filters ─────────────────────────── */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-neutral-400" />
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Filter</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            category="all"
            isActive={filter === "all"}
            count={categoryCounts.all}
            onClick={() => setFilter("all")}
          />
          <CategoryChip
            category="unread"
            isActive={filter === "unread"}
            count={categoryCounts.unread}
            onClick={() => setFilter("unread")}
          />
          <div className="w-px h-6 bg-neutral-200 self-center mx-1" />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              category={cat}
              isActive={filter === cat}
              count={categoryCounts[cat] || 0}
              onClick={() => setFilter(cat)}
            />
          ))}
        </div>
      </div>

      {/* ── Notification List ────────────────── */}
      <div className="card p-0 overflow-hidden">
        {groupedByDate.length > 0 ? (
          groupedByDate.map(({ label, items }) => (
            <div key={label}>
              {/* Date group header */}
              <div className="flex items-center gap-3 px-5 py-3 bg-neutral-50/80 border-b border-neutral-100">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-sm">
                  {label}
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              {/* Notifications */}
              <div className="divide-y divide-neutral-100">
                {items.map((notif) => (
                  <NotifRow
                    key={notif.id}
                    notif={notif}
                    onMarkRead={markAsRead}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-5 shadow-sm">
              <BellOff size={36} className="text-neutral-300" />
            </div>
            <p className="text-lg font-extrabold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
              {filter === "unread"
                ? "Semua sudah dibaca!"
                : filter !== "all"
                ? `Tidak ada notifikasi ${CATEGORY_CONFIG[filter as NotificationCategory]?.label}`
                : "Belum ada notifikasi"}
            </p>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm leading-relaxed">
              {filter === "unread"
                ? "Bagus! Anda sudah membaca semua pemberitahuan terbaru."
                : "Semua pembaruan sistem dan informasi rekam medis akan muncul di sini."}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Lihat semua notifikasi →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
