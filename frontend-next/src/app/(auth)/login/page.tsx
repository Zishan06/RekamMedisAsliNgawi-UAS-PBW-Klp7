"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Activity, Shield, Stethoscope, Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/auth-context";
import { ROLE_OPTIONS, DEMO_ACCOUNTS, type UserRole } from "@/lib/auth";

/* ─────────────────────────────────────────────
   Login Page — RME Ngawi
   Tema: Samsung Health + Jawa Modern
───────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("dokter");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Redirect jika sudah login
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const result = await login({ email, password, role });

    if (result.success) {
      toast.success("Selamat datang kembali!", {
        description: `Login sebagai ${result.user?.roleLabel}`,
      });
      router.push("/dashboard");
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setRole(demoRole);
    setError(null);
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    admin: <Shield size={16} />,
    dokter: <Stethoscope size={16} />,
    perawat: <Heart size={16} />,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-page">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-surface-page">

      {/* ── Left Panel — Branding ──────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, var(--color-primary-900) 0%, var(--color-primary-700) 45%, var(--color-primary-600) 100%)",
        }}
      >
        {/* Jawa Modern Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/patterns/jawa-modern-pattern.svg')",
            backgroundSize: "320px",
            backgroundRepeat: "repeat",
            opacity: 0.06,
          }}
        />

        {/* Gemini Pattern Subtle Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/patterns/bg-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.04,
            mixBlendMode: "overlay",
          }}
        />

        {/* Decorative Geometric Circles */}
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-earth-400) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-20 w-[360px] h-[360px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--color-primary-400) 0%, transparent 70%)" }} />

        {/* ── Top — Logo & Brand ─────────────── */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="relative w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Activity size={24} className="text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-earth-400 border-2 border-primary-900" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight" style={{ fontFamily: "var(--font-sans)" }}>
                RME Ngawi
              </h1>
              <p className="text-xs text-primary-200 font-medium tracking-wider uppercase">
                Rekam Medis Elektronik
              </p>
            </div>
          </div>

          {/* ── Javanese Accent ─────────────── */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rotate-45 bg-earth-300/70" />
              <div className="w-1.5 h-1.5 rotate-45 bg-white/40" />
              <div className="w-1.5 h-1.5 rotate-45 bg-earth-300/70" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-white/30 to-transparent" />
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "var(--font-sans)" }}>
            Sistem Informasi<br />
            <span style={{
              background: "linear-gradient(135deg, var(--color-earth-300), var(--color-earth-400))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Kesehatan Digital
            </span>
          </h2>
          <p className="text-primary-200 text-base leading-relaxed max-w-sm">
            Platform rekam medis modern untuk RSUD Ngawi. Kelola data pasien,
            kunjungan, dan diagnosis secara efisien dan aman.
          </p>
        </div>

        {/* ── Bottom — Stats ─────────────────── */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Pasien Aktif", value: "2.847" },
              { label: "Dokter", value: "48" },
              { label: "Rekam Medis", value: "12.5K" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                <p className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-sans)" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-primary-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-primary-400 mt-4 text-center">
            © 2025 RSUD Ngawi — Sistem Rekam Medis Elektronik v1.0
          </p>
        </div>
      </div>

      {/* ── Right Panel — Login Form ───────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24 overflow-y-auto">

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))" }}>
            <Activity size={20} className="text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-earth-500 border-2 border-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-neutral-900" style={{ fontFamily: "var(--font-sans)" }}>
              RME Ngawi
            </h1>
            <p className="text-2xs text-neutral-400 font-medium tracking-wider uppercase">RSUD Ngawi</p>
          </div>
        </div>

        <div className="max-w-[400px] w-full mx-auto animate-fade-in">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-neutral-900 mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
              Masuk ke Sistem
            </h2>
            <p className="text-neutral-500 text-sm">
              Gunakan kredensial yang diberikan oleh administrator rumah sakit.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 flex gap-3 p-3.5 rounded-xl bg-danger-light border border-danger/20 animate-fade-in">
              <span className="text-danger text-sm flex-1">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Email
              </label>
              <div className={cn(
                "relative rounded-xl border transition-all duration-200",
                focusedField === "email"
                  ? "border-primary-400 ring-2 ring-primary-500/20 bg-white"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
              )}>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="contoh@rme.test"
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-transparent text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none rounded-xl"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className={cn(
                "relative flex items-center rounded-xl border transition-all duration-200",
                focusedField === "password"
                  ? "border-primary-400 ring-2 ring-primary-500/20 bg-white"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
              )}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="flex-1 px-4 py-3 bg-transparent text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none rounded-xl"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="px-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    disabled={isSubmitting}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all duration-200",
                      role === opt.value
                        ? "border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20"
                        : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:border-neutral-300 hover:bg-white"
                    )}
                  >
                    <span className={cn(
                      "transition-colors duration-200",
                      role === opt.value ? "text-primary-600" : "text-neutral-400"
                    )}>
                      {roleIcons[opt.value]}
                    </span>
                    <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200",
                "text-white shadow-md shadow-primary-600/25 mt-2",
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0"
              )}
              style={{
                background: isSubmitting
                  ? "var(--color-primary-500)"
                  : "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            {/* Javanese Accent Divider */}
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px flex-1 bg-neutral-200" />
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rotate-45 bg-earth-300" />
                <div className="w-1 h-1 rotate-45 bg-primary-300" />
                <div className="w-1 h-1 rotate-45 bg-earth-300" />
              </div>
              <span className="text-2xs font-semibold text-neutral-400 uppercase tracking-wider px-2">
                Akun Demo
              </span>
              <div className="flex gap-0.5">
                <div className="w-1 h-1 rotate-45 bg-earth-300" />
                <div className="w-1 h-1 rotate-45 bg-primary-300" />
                <div className="w-1 h-1 rotate-45 bg-earth-300" />
              </div>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.role.toLowerCase() as UserRole)}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 text-left group",
                    "border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-primary-600 w-16">{acc.role}</span>
                    <span className="text-xs text-neutral-500">{acc.email}</span>
                  </div>
                  <ChevronRight size={14} className="text-neutral-300 group-hover:text-primary-400 transition-colors" />
                </button>
              ))}
            </div>
            <p className="text-2xs text-neutral-400 text-center mt-3">
              Password semua akun demo: <span className="font-mono font-bold text-neutral-500">demo1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
