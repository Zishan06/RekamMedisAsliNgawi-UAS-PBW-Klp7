"use client";

import { GlobalSearch } from "./GlobalSearch";
import { NotificationPanel } from "./NotificationPanel";
import Link from "next/link";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/cn";
import { getInitials, getAvatarColor } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Shield,
  Stethoscope,
  Heart,
} from "lucide-react";
import type { UserRole } from "@/lib/auth";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface TopbarProps {
  onMenuToggle: () => void;
}

/* ─────────────────────────────────────────────
   Role Badges
───────────────────────────────────────────── */
const ROLE_CONFIG: Record<UserRole, { icon: React.ReactNode; color: string; bg: string }> = {
  admin: {
    icon: <Shield size={11} />,
    color: "text-purple-700",
    bg: "bg-purple-100",
  },
  dokter: {
    icon: <Stethoscope size={11} />,
    color: "text-primary-700",
    bg: "bg-primary-100",
  },
  perawat: {
    icon: <Heart size={11} />,
    color: "text-earth-700",
    bg: "bg-earth-100",
  },
};

/* ─────────────────────────────────────────────
   Profile Dropdown
───────────────────────────────────────────── */
interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!user) return null;

  const initials = getInitials(user.name);
  const avatarBg = getAvatarColor(user.name);
  const roleConf = ROLE_CONFIG[user.role];

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-0 top-full mt-2 w-64 rounded-2xl border border-neutral-200 bg-white z-50",
        "shadow-xl shadow-neutral-900/10",
        "transition-all duration-200 origin-top-right",
        isOpen
          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}
    >
      {/* ── User Info ─────────────────────── */}
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)` }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-neutral-900 truncate leading-tight">
              {user.name}
            </p>
            <div className={cn(
              "inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-2xs font-semibold",
              roleConf.bg, roleConf.color
            )}>
              {roleConf.icon}
              {user.roleLabel}
            </div>
          </div>
        </div>
        <p className="text-2xs text-neutral-400 mt-2 truncate">{user.email}</p>
      </div>

      {/* ── Javanese Accent Divider ──────── */}
      <div className="px-4">
        <div className="flex items-center gap-1.5">
          <div className="h-px flex-1 bg-neutral-100" />
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rotate-45 bg-earth-200" />
            <div className="w-1 h-1 rotate-45 bg-primary-200" />
            <div className="w-1 h-1 rotate-45 bg-earth-200" />
          </div>
          <div className="h-px flex-1 bg-neutral-100" />
        </div>
      </div>

      {/* ── Menu Items ────────────────────── */}
      <div className="p-2">
        <Link
          href="/profile"
          id="profile-menu-item"
          onClick={onClose}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
            "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
          )}
        >
          <User size={16} className="text-neutral-400" />
          <span className="font-medium">Profil Saya</span>
        </Link>

        <Link
          href="/settings"
          id="settings-menu-item"
          onClick={onClose}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
            "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
          )}
        >
          <Settings size={16} className="text-neutral-400" />
          <span className="font-medium">Pengaturan</span>
        </Link>
      </div>

      {/* ── Logout ──────────────────────────── */}
      <div className="p-2 pt-0">
        <div className="border-t border-neutral-100 pt-2">
          <button
            id="logout-menu-item"
            onClick={() => {
              onClose();
              logout();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
              "text-danger hover:bg-danger-light"
            )}
          >
            <LogOut size={16} />
            <span className="font-semibold">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Topbar Component
───────────────────────────────────────────── */
export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = useCallback(() => setDropdownOpen((p) => !p), []);
  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  const displayName = user?.name ?? "Pengguna";
  const displayRole = user?.roleLabel ?? "—";
  const initials = getInitials(displayName);
  const avatarBg = getAvatarColor(displayName);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6",
        "h-[var(--spacing-topbar)] bg-surface-card/80 backdrop-blur-xl",
        "border-b border-neutral-200/80"
      )}
    >
      {/* ── Hamburger (mobile/tablet) ──────── */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="Buka menu navigasi"
      >
        <Menu size={22} />
      </button>

      {/* ── Search Bar ────────────────────────── */}
      <GlobalSearch />

      {/* ── Right Section ─────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <NotificationPanel />

        {/* ── Vertical Divider ────────────────── */}
        <div className="hidden sm:block w-px h-8 bg-neutral-200 mx-1" />

        {/* ── User Profile with Dropdown ──────── */}
        <div className="relative">
          <button
            id="user-profile-btn"
            onClick={toggleDropdown}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            className={cn(
              "flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-colors duration-200",
              dropdownOpen ? "bg-neutral-100" : "hover:bg-neutral-100"
            )}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)` }}
            >
              {initials}
            </div>

            {/* Name + Role — hidden on mobile */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-neutral-800 leading-tight">
                {displayName}
              </p>
              <p className="text-2xs text-neutral-400 font-medium">
                {displayRole}
              </p>
            </div>

            <ChevronDown
              size={14}
              className={cn(
                "hidden sm:block text-neutral-400 transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown */}
          <ProfileDropdown isOpen={dropdownOpen} onClose={closeDropdown} />
        </div>
      </div>
    </header>
  );
}
