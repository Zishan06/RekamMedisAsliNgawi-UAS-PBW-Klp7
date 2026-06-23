/**
 * types/auth.ts — Tipe data untuk autentikasi & pengguna.
 */

export type RolePengguna =
  | "admin"
  | "dokter"
  | "perawat"
  | "bidan"
  | "apoteker"
  | "rekam_medis"
  | "kasir";

export interface Pengguna {
  id: number;
  nip?: string;
  namaLengkap: string;
  email: string;
  role: RolePengguna;
  jabatan?: string;
  poliklinik?: string;
  avatar?: string;
  isAktif: boolean;
  createdAt: string;
}

export interface AuthState {
  pengguna: Pengguna | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  pengguna: Pengguna;
}

/* Role label mapping */
export const ROLE_LABELS: Record<RolePengguna, string> = {
  admin: "Administrator",
  dokter: "Dokter",
  perawat: "Perawat",
  bidan: "Bidan",
  apoteker: "Apoteker",
  rekam_medis: "Petugas Rekam Medis",
  kasir: "Kasir",
};
