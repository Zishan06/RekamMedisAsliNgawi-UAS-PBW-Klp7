/**
 * api.ts — Konfigurasi API client untuk komunikasi dengan backend Go.
 * Menggunakan native fetch dengan typed helper functions.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/* ─────────────────────────────────────────────
   Types — Generic
───────────────────────────────────────────── */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ─────────────────────────────────────────────
   Types — Backend Response Shape
   (sesuai struct database SawitDB / Go backend)
───────────────────────────────────────────── */

/** Response envelope dari backend Prabogo */
export interface BackendEnvelope {
  status: string;          // "sukses" | "gagal"
  data?: string;           // JSON string dari SawitDB
  pasien?: string;         // untuk /api/pasien/:id
  riwayat?: string;        // untuk /api/pasien/:id
  error?: string;
}

/** Struct pasien dari database */
export interface BackendPasien {
  id: number;
  no_rm: string;
  nama: string;
  nik: string;
  jk: string;              // "L" atau "P"
  tgl_lahir: string;       // "YYYY-MM-DD"
  gol_darah: string;
  no_hp: string;
  alamat: string;
  status: string;
}

/** Struct dokter dari database */
export interface BackendDokter {
  id: number;
  nama: string;
  spesialisasi: string;
  no_sip: string;
  telp: string;
}

/** Struct perawat dari database */
export interface BackendPerawat {
  id: number;
  nama: string;
  ruangan: string;
  shift: string;
  telp: string;
}

/** Struct rekam medis dari database */
export interface BackendRekamMedis {
  id: number;
  pasien_id: number;
  dokter_id: number;
  tanggal: string;
  poli: string;
  diagnosa: string;
  icd10: string;
  anamnesis: string;
  pemeriksaan: string;
  obat: string;
  tindakan: string;
  status: string;
}

/* ─────────────────────────────────────────────
   Helper — parse double-encoded JSON dari SawitDB
   Backend mengembalikan data sebagai JSON string,
   bukan object langsung.
───────────────────────────────────────────── */
export function parseBackendData<T>(raw: string | undefined | null): T[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed as T[];
    if (parsed && typeof parsed === "object") return [parsed] as T[];
    return [];
  } catch {
    return [];
  }
}

export function parseBackendSingle<T>(raw: string | undefined | null): T | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) return parsed[0] ?? null;
    if (parsed && typeof parsed === "object") return parsed as T;
    return null;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
   Core Fetch Helper
───────────────────────────────────────────── */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  // Attach auth token jika tersedia
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rme_token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(res.status, `HTTP ${res.status}: ${res.statusText}`, body);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

/* ─────────────────────────────────────────────
   HTTP Method Shortcuts
───────────────────────────────────────────── */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { method: "DELETE", ...options }),
};

/* ─────────────────────────────────────────────
   Domain API — Pasien
───────────────────────────────────────────── */
/* Payload untuk POST /api/pasien */
export interface CreatePasienPayload {
  no_rm: string;
  nama: string;
  nik: string;
  jk: string;          // "L" atau "P"
  tgl_lahir: string;   // "YYYY-MM-DD"
  gol_darah: string;
  no_hp: string;
  alamat: string;
  status?: string;     // default "Aktif" di backend
}

export const pasienApi = {
  /** Ambil semua pasien */
  getAll: async (): Promise<BackendPasien[]> => {
    const res = await api.get<BackendEnvelope>("/api/pasien");
    return parseBackendData<BackendPasien>(res.data);
  },

  /** Ambil satu pasien beserta riwayat rekam medisnya */
  getById: async (id: string | number): Promise<{
    pasien: BackendPasien | null;
    riwayat: BackendRekamMedis[];
  }> => {
    const res = await api.get<BackendEnvelope>(`/api/pasien/${id}`);
    return {
      pasien: parseBackendSingle<BackendPasien>(res.pasien),
      riwayat: parseBackendData<BackendRekamMedis>(res.riwayat),
    };
  },

  /** Tambah pasien baru → POST /api/pasien */
  create: async (payload: CreatePasienPayload): Promise<BackendEnvelope> => {
    return api.post<BackendEnvelope>("/api/pasien", payload);
  },
};

/* ─────────────────────────────────────────────
   Domain API — Dokter
───────────────────────────────────────────── */
export const dokterApi = {
  /** Ambil semua dokter */
  getAll: async (): Promise<BackendDokter[]> => {
    const res = await api.get<BackendEnvelope>("/api/dokter");
    return parseBackendData<BackendDokter>(res.data);
  },
};

/* ─────────────────────────────────────────────
   Domain API — Perawat
───────────────────────────────────────────── */
export const perawatApi = {
  /** Ambil semua perawat */
  getAll: async (): Promise<BackendPerawat[]> => {
    const res = await api.get<BackendEnvelope>("/api/perawat");
    return parseBackendData<BackendPerawat>(res.data);
  },
};

/* ─────────────────────────────────────────────
   Domain API — Rekam Medis
───────────────────────────────────────────── */
/* Payload untuk POST /api/rekam-medis */
export interface CreateRekamMedisPayload {
  pasien_id: number;
  dokter_id: number;
  tanggal: string;
  poli: string;
  diagnosa: string;
  icd10?: string;
  anamnesis: string;
  pemeriksaan: string;
  obat?: string;
  tindakan?: string;
  status: string;
}

export const rekamMedisApi = {
  /** Ambil semua rekam medis */
  getAll: async (): Promise<BackendRekamMedis[]> => {
    const res = await api.get<BackendEnvelope>("/api/rekam-medis");
    return parseBackendData<BackendRekamMedis>(res.data);
  },

  /** Ambil rekam medis berdasarkan ID */
  getById: async (id: string | number): Promise<BackendRekamMedis | null> => {
    const res = await api.get<BackendEnvelope>(`/api/rekam-medis/${id}`);
    return parseBackendSingle<BackendRekamMedis>(res.data);
  },

  /** Tambah rekam medis baru → POST /api/rekam-medis */
  create: async (payload: CreateRekamMedisPayload): Promise<BackendEnvelope> => {
    return api.post<BackendEnvelope>("/api/rekam-medis", payload);
  },
};

/* ─────────────────────────────────────────────
   Adapter — Konversi field backend → frontend
───────────────────────────────────────────── */

/** Hitung umur dari tanggal lahir ISO string */
export function hitungUmur(tglLahir: string): number {
  try {
    const lahir = new Date(tglLahir);
    const sekarang = new Date();
    let umur = sekarang.getFullYear() - lahir.getFullYear();
    const m = sekarang.getMonth() - lahir.getMonth();
    if (m < 0 || (m === 0 && sekarang.getDate() < lahir.getDate())) {
      umur--;
    }
    return umur;
  } catch {
    return 0;
  }
}

/** Map jk (L/P) → jenisKelamin string */
export function mapJenisKelamin(jk: string): "Laki-laki" | "Perempuan" {
  return jk === "L" ? "Laki-laki" : "Perempuan";
}
