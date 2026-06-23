/**
 * utils.ts — Kumpulan utility functions umum
 * untuk kebutuhan formatting, parsing, dan helper logic.
 */

import { format, parseISO, differenceInYears, isValid } from "date-fns";
import { id as localeId } from "date-fns/locale";

/* ─────────────────────────────────────────────
   Date & Time Utilities
───────────────────────────────────────────── */

/**
 * Format tanggal ke format lokal Indonesia.
 * @example formatDate("2024-01-15") → "15 Januari 2024"
 */
export function formatDate(
  date: string | Date | null | undefined,
  fmt = "dd MMMM yyyy"
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "Tanggal tidak valid";
  return format(d, fmt, { locale: localeId });
}

/**
 * Format tanggal + waktu.
 * @example formatDateTime("2024-01-15T09:30:00") → "15 Jan 2024, 09:30"
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  return formatDate(date, "dd MMM yyyy, HH:mm");
}

/**
 * Hitung usia dari tanggal lahir.
 * @example calcAge("1990-05-20") → 34
 */
export function calcAge(birthDate: string | Date | null | undefined): number | null {
  if (!birthDate) return null;
  const d = typeof birthDate === "string" ? parseISO(birthDate) : birthDate;
  if (!isValid(d)) return null;
  return differenceInYears(new Date(), d);
}

/* ─────────────────────────────────────────────
   String Utilities
───────────────────────────────────────────── */

/**
 * Inisial dari nama lengkap (maks 2 karakter).
 * @example getInitials("Budi Santoso") → "BS"
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/**
 * Capitalize huruf pertama setiap kata.
 */
export function titleCase(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Truncate string dengan ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/* ─────────────────────────────────────────────
   Number / ID Utilities
───────────────────────────────────────────── */

/**
 * Format nomor rekam medis agar consistent.
 * @example formatRMNumber("123") → "RM-000123"
 */
export function formatRMNumber(id: number | string): string {
  return `RM-${String(id).padStart(6, "0")}`;
}

/**
 * Format angka ke currency IDR.
 * @example formatCurrency(150000) → "Rp 150.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/* ─────────────────────────────────────────────
   Misc
───────────────────────────────────────────── */

/**
 * Delay / sleep async.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate placeholder avatar color dari nama.
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "#2563eb", "#7c3aed", "#059669", "#d97706",
    "#dc2626", "#0891b2", "#9333ea", "#16a34a",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}
