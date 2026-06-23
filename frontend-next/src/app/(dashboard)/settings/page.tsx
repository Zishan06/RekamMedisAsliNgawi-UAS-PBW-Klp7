"use client";

import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import {
  Settings as SettingsIcon,
  Palette,
  User,
  Shield,
  Monitor,
  Moon,
  Sun,
  Bell,
  Sparkles,
  Maximize,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  // Dummy Settings States
  const [systemSettings, setSystemSettings] = useState({
    animations: true,
    desktopNotifications: true,
    compactMode: false,
  });

  // Dummy Form States
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  if (!user) return null;

  const handleToggle = (key: keyof typeof systemSettings) => {
    const newValue = !systemSettings[key];
    setSystemSettings((prev) => ({ ...prev, [key]: newValue }));
    
    toast.success(`Pengaturan sistem berhasil diperbarui`);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Informasi akun berhasil disimpan");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Kata sandi berhasil diubah");
    setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* ── Page Header ───────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-900">Pengaturan</h1>
        <p className="text-neutral-500 mt-1">Sesuaikan preferensi tampilan dan kelola akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: System & Theme ───── */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tampilan / Theme */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Palette size={20} className="text-primary-600" />
              Tampilan
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setTheme("light");
                  toast.success("Tema Light diaktifkan");
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                  theme === "light" || (theme === "system" && !window.matchMedia("(prefers-color-scheme: dark)").matches)
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-neutral-200 bg-surface-card text-neutral-600 hover:border-primary-300"
                )}
              >
                <Sun size={24} />
                <span className="font-semibold text-sm">Light</span>
              </button>
              
              <button
                onClick={() => {
                  setTheme("dark");
                  toast.success("Tema Dark (Samsung Health) diaktifkan");
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all",
                  theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                    ? "border-primary-500 bg-primary-950 text-primary-400"
                    : "border-neutral-200 bg-surface-card text-neutral-600 hover:border-primary-300"
                )}
              >
                <Moon size={24} />
                <span className="font-semibold text-sm">Dark</span>
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-4 leading-relaxed">
              Pilih preferensi tema aplikasi. Pilihan Anda akan disimpan dan diterapkan pada kunjungan berikutnya.
            </p>
          </div>

          {/* Pengaturan Sistem */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Monitor size={20} className="text-primary-600" />
              Pengaturan Sistem
            </h3>

            <div className="space-y-4">
              {/* Animasi UI */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">Animasi UI</p>
                    <p className="text-2xs text-neutral-500">Aktifkan transisi halus</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={systemSettings.animations} onChange={() => handleToggle("animations")} />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* Notifikasi Desktop */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">Notifikasi Desktop</p>
                    <p className="text-2xs text-neutral-500">Tampilkan popup di OS</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={systemSettings.desktopNotifications} onChange={() => handleToggle("desktopNotifications")} />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <Maximize size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">Compact Mode</p>
                    <p className="text-2xs text-neutral-500">Tampilan tabel lebih padat</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={systemSettings.compactMode} onChange={() => handleToggle("compactMode")} />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Account Form ────── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ubah Profil */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              Informasi Akun
            </h3>
            
            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-surface-page focus-ring transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Email Utama</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-surface-page focus-ring transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-primary-600/20">
                  <Save size={16} />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* Keamanan & Kata Sandi */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-primary-600" />
              Keamanan Akun
            </h3>
            
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-surface-page focus-ring transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-surface-page focus-ring transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-900 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-neutral-900/10">
                  <Save size={16} />
                  Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
