/**
 * types/index.ts — Barrel export untuk semua types.
 * Import dari "@/types" bisa langsung dapat semua type.
 */

export * from "./patient";
export * from "./medical-record";
export * from "./auth";

/* ─────────────────────────────────────────────
   Common / Generic Types
───────────────────────────────────────────── */

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

/** Generic paginated list response */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Generic query params untuk list endpoints */
export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Select option untuk dropdown/combobox */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

/** Status badge config */
export interface StatusConfig {
  label: string;
  color: "primary" | "earth" | "success" | "warning" | "danger" | "neutral";
}
