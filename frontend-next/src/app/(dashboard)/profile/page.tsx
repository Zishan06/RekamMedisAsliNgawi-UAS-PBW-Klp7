"use client";

import { useAuth } from "@/context/auth-context";
import { getInitials, getAvatarColor } from "@/lib/utils";
import { cn } from "@/lib/cn";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Briefcase,
  Hash,
  Clock,
  LogIn,
  FileText,
  UserPlus,
  Bell
} from "lucide-react";

/* ─────────────────────────────────────────────
   Dummy Activity Data
───────────────────────────────────────────── */
const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "login",
    title: "Login ke sistem",
    timestamp: "Baru saja",
    icon: <LogIn size={16} className="text-primary-600" />,
    bg: "bg-primary-100",
  },
  {
    id: 2,
    type: "rekam_medis",
    title: "Membuat rekam medis baru (RM-2024-001)",
    timestamp: "2 jam yang lalu",
    icon: <FileText size={16} className="text-success-dark" />,
    bg: "bg-success-light",
  },
  {
    id: 3,
    type: "pasien",
    title: "Menambah data pasien (Budi Santoso)",
    timestamp: "Kemarin, 14:30",
    icon: <UserPlus size={16} className="text-earth-600" />,
    bg: "bg-earth-100",
  },
  {
    id: 4,
    type: "notifikasi",
    title: "Membaca pengumuman jadwal shift",
    timestamp: "Kemarin, 09:15",
    icon: <Bell size={16} className="text-warning-dark" />,
    bg: "bg-warning-light",
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const initials = getInitials(user.name);
  const avatarBg = getAvatarColor(user.name);

  // Dummy additional info
  const userInfo = {
    phone: "+62 812-3456-7890",
    address: "Jl. Diponegoro No. 123, Ngawi, Jawa Timur",
    employeeId: "PEG-2021-042",
    department: user.role === "admin" ? "Manajemen" : user.role === "dokter" ? "Poli Umum" : "IGD",
    joinDate: "15 Agustus 2021",
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* ── Page Header ───────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-900">Profil Saya</h1>
        <p className="text-neutral-500 mt-1">Kelola informasi personal dan riwayat aktivitas Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Left Column: Profile Card ─────── */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-primary-400 opacity-20" />
            
            <div className="relative mt-8 mb-4 flex justify-center">
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary-900/20 ring-4 ring-white dark:ring-surface-card"
                style={{ background: `linear-gradient(135deg, ${avatarBg}, ${avatarBg}cc)` }}
              >
                {initials}
              </div>
            </div>

            <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
            <p className="text-sm text-neutral-500">{user.email}</p>

            <div className="flex justify-center mt-3 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
                <Shield size={14} />
                {user.roleLabel}
              </div>
            </div>

            <div className="divider" />

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <Hash size={16} />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-wider">Nomor Pegawai</p>
                  <p className="font-medium text-neutral-800">{userInfo.employeeId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <Briefcase size={16} />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-wider">Departemen</p>
                  <p className="font-medium text-neutral-800">{userInfo.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-wider">Tanggal Bergabung</p>
                  <p className="font-medium text-neutral-800">{userInfo.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Info & Activity ─── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informasi Pribadi Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              Informasi Pribadi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} /> Nama Lengkap
                </span>
                <p className="font-medium text-neutral-800">{user.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={14} /> Email
                </span>
                <p className="font-medium text-neutral-800">{user.email}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone size={14} /> Nomor Telepon
                </span>
                <p className="font-medium text-neutral-800">{userInfo.phone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14} /> Alamat
                </span>
                <p className="font-medium text-neutral-800">{userInfo.address}</p>
              </div>
            </div>
          </div>

          {/* Aktivitas Card */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-primary-600" />
              Riwayat Aktivitas Terakhir
            </h3>

            <div className="space-y-6">
              {RECENT_ACTIVITIES.map((activity, index) => (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline Line */}
                  {index !== RECENT_ACTIVITIES.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-full bg-neutral-100 -ml-px" />
                  )}
                  
                  {/* Icon */}
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10", activity.bg)}>
                    {activity.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <p className="text-sm font-medium text-neutral-800">{activity.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-500">
                      <Clock size={12} />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
