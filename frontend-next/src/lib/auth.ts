/**
 * auth.ts — Mock Authentication Module
 * RME Ngawi — Frontend-only auth (no backend needed)
 *
 * Menyimpan session di localStorage dengan key SESSION_KEY.
 * Ganti dengan real JWT / API calls saat backend tersedia.
 */

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

export type UserRole = "admin" | "dokter" | "perawat";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  /** Label yang ditampilkan di UI */
  roleLabel: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResult {
  success: boolean;
  user: AuthUser | null;
  error: string | null;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */

const SESSION_KEY = "rme_ngawi_session";

/* ─────────────────────────────────────────────
   Dummy User Database
   Password sama untuk semua akun demo: "demo1234"
───────────────────────────────────────────── */

const DUMMY_USERS: (AuthUser & { password: string })[] = [
  {
    id: "usr-001",
    name: "Ahmad Fauzi, S.Kom",
    email: "admin@rme.test",
    password: "demo1234",
    role: "admin",
    roleLabel: "Administrator",
    avatar: null,
  },
  {
    id: "usr-002",
    name: "dr. Retno Wulandari, Sp.PD",
    email: "dokter@rme.test",
    password: "demo1234",
    role: "dokter",
    roleLabel: "Dokter Spesialis",
    avatar: null,
  },
  {
    id: "usr-003",
    name: "Siti Rahayu, Amd.Kep",
    email: "perawat@rme.test",
    password: "demo1234",
    role: "perawat",
    roleLabel: "Perawat",
    avatar: null,
  },
];

/* ─────────────────────────────────────────────
   Role Labels (untuk pilihan dropdown login)
───────────────────────────────────────────── */

export const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: "admin", label: "Administrator", description: "Akses penuh sistem" },
  { value: "dokter", label: "Dokter", description: "Rekam medis & diagnosis" },
  { value: "perawat", label: "Perawat", description: "Monitoring & perawatan" },
];

/* ─────────────────────────────────────────────
   Demo Credentials Hints
───────────────────────────────────────────── */

export const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@rme.test", password: "demo1234" },
  { role: "Dokter", email: "dokter@rme.test", password: "demo1234" },
  { role: "Perawat", email: "perawat@rme.test", password: "demo1234" },
];

/* ─────────────────────────────────────────────
   Mock Auth Functions
───────────────────────────────────────────── */

/**
 * Simulasi login — cocokkan email + password + role.
 * Tambahkan delay kecil agar terasa seperti API call.
 */
export async function mockLogin(credentials: LoginCredentials): Promise<AuthResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 900));

  const { email, password, role } = credentials;

  const found = DUMMY_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      u.role === role
  );

  if (!found) {
    return {
      success: false,
      user: null,
      error: "Email, password, atau role tidak sesuai. Coba akun demo di bawah.",
    };
  }

  // Buat session object (tanpa password)
  const { password: _, ...user } = found;

  // Simpan ke localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  return { success: true, user, error: null };
}

/**
 * Logout — hapus session dari localStorage.
 */
export function mockLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

/**
 * Ambil session user dari localStorage.
 * Returns null jika belum login atau session tidak valid.
 */
export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    // Validasi minimal — pastikan field penting ada
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Cek apakah user sudah login.
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}
