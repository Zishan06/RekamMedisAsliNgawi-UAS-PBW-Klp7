"use client";

/**
 * NotificationPanel.tsx — Dropdown notifikasi modern seperti Slack/Gmail.
 *
 * Fitur:
 * - Bell dengan badge unread count (animated)
 * - Dropdown panel dengan smooth animation
 * - Grouping berdasarkan waktu (Hari ini, Kemarin, Lebih lama)
 * - Icon per tipe notifikasi dengan warna
 * - Status read/unread dengan visual yang jelas
 * - Mark as read per item
 * - Mark all as read
 * - Link ke halaman notifikasi penuh
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Users,
  ClipboardList,
  Calendar,
  Star,
  Activity,
  Settings,
  BellOff,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useNotifications } from "@/context/notification-context";
import { NotificationItem, NotificationType, NotificationCategory } from "@/lib/dummy-notifications";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { id as localeId } from "date-fns/locale";

/* ─────────────────────────────────────────────
   Icon helpers
───────────────────────────────────────────── */
function getTypeIcon(type: NotificationType) {
  switch (type) {
    case "info":
      return (
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
          <Info size={17} />
        </div>
      );
    case "success":
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 size={17} />
        </div>
      );
    case "warning":
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
          <AlertTriangle size={17} />
        </div>
      );
    case "alert":
      return (
        <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle size={17} />
        </div>
      );
  }
}

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case "pasien":
      return <Users size={10} className="text-primary-500" />;
    case "rekam-medis":
      return <ClipboardList size={10} className="text-blue-500" />;
    case "jadwal":
      return <Calendar size={10} className="text-amber-500" />;
    case "evaluasi":
      return <Star size={10} className="text-purple-500" />;
    case "kunjungan":
      return <Activity size={10} className="text-emerald-500" />;
    case "sistem":
      return <Settings size={10} className="text-neutral-500" />;
  }
}

/* ─────────────────────────────────────────────
   Group by time
───────────────────────────────────────────── */
function groupNotificationsByTime(notifications: NotificationItem[]) {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const today: NotificationItem[] = [];
  const yesterday: NotificationItem[] = [];
  const older: NotificationItem[] = [];

  sorted.forEach((n) => {
    const d = new Date(n.timestamp);
    if (isToday(d)) today.push(n);
    else if (isYesterday(d)) yesterday.push(n);
    else older.push(n);
  });

  return { today, yesterday, older };
}

/* ─────────────────────────────────────────────
   Notification Item Row
───────────────────────────────────────────── */
function NotifRow({
  notif,
  onMarkRead,
  onClick,
}: {
  notif: NotificationItem;
  onMarkRead: (id: string) => void;
  onClick: (id: string, href?: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(notif.id, notif.href)}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3.5 text-left group transition-all duration-150",
        "border-b border-neutral-50 last:border-0",
        notif.isRead
          ? "hover:bg-neutral-50/80"
          : "bg-primary-50/40 hover:bg-primary-50/70"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 relative mt-0.5">
        {getTypeIcon(notif.type)}
        {/* Category badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
          {getCategoryIcon(notif.category)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-tight truncate",
              notif.isRead
                ? "font-medium text-neutral-600"
                : "font-bold text-neutral-900"
            )}
          >
            {notif.title}
          </p>
          {/* Unread dot */}
          {!notif.isRead && (
            <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1 shadow-sm shadow-primary-500/50" />
          )}
        </div>
        <p
          className={cn(
            "text-xs mt-0.5 leading-relaxed line-clamp-2",
            notif.isRead ? "text-neutral-400" : "text-neutral-600"
          )}
        >
          {notif.summary}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-2xs text-neutral-400 font-medium">
            {formatDistanceToNow(new Date(notif.timestamp), {
              addSuffix: true,
              locale: localeId,
            })}
          </span>
          {notif.actor && (
            <>
              <span className="text-2xs text-neutral-300">•</span>
              <span className="text-2xs text-neutral-400">{notif.actor}</span>
            </>
          )}
        </div>
      </div>

      {/* Mark as read button — appears on hover for unread */}
      {!notif.isRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notif.id);
          }}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5 p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
          title="Tandai sudah dibaca"
        >
          <Check size={13} />
        </button>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Time Group Header
───────────────────────────────────────────── */
function TimeGroupHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50/60">
      <span className="text-2xs font-bold text-neutral-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="h-px flex-1 bg-neutral-100" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Panel Component
───────────────────────────────────────────── */
export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [prevUnread, setPrevUnread] = useState(0);
  const [bellShake, setBellShake] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Bell shake animation when new notification arrives
  useEffect(() => {
    if (unreadCount > prevUnread && prevUnread !== 0) {
      setBellShake(true);
      setTimeout(() => setBellShake(false), 700);
    }
    setPrevUnread(unreadCount);
  }, [unreadCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleNotificationClick = useCallback(
    (id: string, href?: string) => {
      markAsRead(id);
      setIsOpen(false);
      if (href) router.push(href);
    },
    [markAsRead, router]
  );

  // Group notifications
  const { today, yesterday, older } = groupNotificationsByTime(notifications);

  // Show 6 most recent in panel
  const MAX_IN_PANEL = 8;
  const displayNotifs = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, MAX_IN_PANEL);

  const { today: dToday, yesterday: dYesterday, older: dOlder } =
    groupNotificationsByTime(displayNotifs);

  return (
    <div ref={containerRef} className="relative">
      {/* ── Bell Button ─────────────────────── */}
      <button
        id="notification-bell-btn"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-label={`Notifikasi${unreadCount > 0 ? ` — ${unreadCount} belum dibaca` : ""}`}
        className={cn(
          "relative p-2.5 rounded-xl transition-all duration-200",
          isOpen
            ? "bg-primary-50 text-primary-600"
            : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
          bellShake && "animate-bell-shake"
        )}
      >
        <Bell
          size={20}
          className={cn(
            "transition-transform duration-200",
            isOpen && "scale-110"
          )}
        />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1",
              "rounded-full bg-danger ring-2 ring-white text-[10px] font-extrabold text-white",
              "shadow-sm shadow-danger/30 transition-all duration-300"
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Active ring when open */}
        {isOpen && (
          <span className="absolute inset-0 rounded-xl ring-2 ring-primary-500/20 pointer-events-none" />
        )}
      </button>

      {/* ── Dropdown Panel ─────────────────── */}
      {isOpen && (
        <div
          ref={panelRef}
          className={cn(
            "absolute right-0 top-full mt-2 z-50",
            "w-[380px] sm:w-[420px] max-h-[85vh]",
            "bg-white rounded-2xl border border-neutral-200",
            "shadow-2xl shadow-neutral-900/12",
            "flex flex-col overflow-hidden",
            "animate-fade-in"
          )}
        >
          {/* ── Panel Header ────────────────── */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-neutral-900 text-base leading-tight" style={{ fontFamily: "var(--font-sans)" }}>
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-2xs font-bold">
                  {unreadCount} baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg"
                >
                  <Check size={13} />
                  Baca semua
                </button>
              )}
            </div>
          </div>

          {/* ── Notification List ────────────── */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {displayNotifs.length > 0 ? (
              <>
                {/* Today */}
                {dToday.length > 0 && (
                  <div>
                    <TimeGroupHeader label="Hari Ini" />
                    {dToday.map((n) => (
                      <NotifRow
                        key={n.id}
                        notif={n}
                        onMarkRead={markAsRead}
                        onClick={handleNotificationClick}
                      />
                    ))}
                  </div>
                )}

                {/* Yesterday */}
                {dYesterday.length > 0 && (
                  <div>
                    <TimeGroupHeader label="Kemarin" />
                    {dYesterday.map((n) => (
                      <NotifRow
                        key={n.id}
                        notif={n}
                        onMarkRead={markAsRead}
                        onClick={handleNotificationClick}
                      />
                    ))}
                  </div>
                )}

                {/* Older */}
                {dOlder.length > 0 && (
                  <div>
                    <TimeGroupHeader label="Lebih Lama" />
                    {dOlder.map((n) => (
                      <NotifRow
                        key={n.id}
                        notif={n}
                        onMarkRead={markAsRead}
                        onClick={handleNotificationClick}
                      />
                    ))}
                  </div>
                )}

                {/* Show more hint */}
                {notifications.length > MAX_IN_PANEL && (
                  <div className="px-4 py-2 text-center">
                    <p className="text-xs text-neutral-400">
                      +{notifications.length - MAX_IN_PANEL} notifikasi lainnya
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                  <BellOff size={28} className="text-neutral-300" />
                </div>
                <p className="text-sm font-bold text-neutral-900">
                  Belum ada notifikasi
                </p>
                <p className="text-xs text-neutral-500 mt-1.5 max-w-[220px] leading-relaxed">
                  Pemberitahuan rekam medis, jadwal, dan sistem akan muncul di sini.
                </p>
              </div>
            )}
          </div>

          {/* ── Panel Footer ────────────────── */}
          <div className="shrink-0 border-t border-neutral-100">
            <Link
              href="/notifikasi"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50/60 transition-colors"
            >
              Lihat Semua Notifikasi
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
