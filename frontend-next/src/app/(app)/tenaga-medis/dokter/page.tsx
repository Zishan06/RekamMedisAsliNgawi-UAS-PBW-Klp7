"use client";

import { Activity } from "lucide-react";

export default function DokterPage() {
  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <Activity size={40} className="text-primary-600" />
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900">Manajemen Dokter</h1>
      <p className="text-neutral-500 max-w-md">
        Halaman ini sedang dalam tahap pengembangan. Nantinya akan berisi daftar dan manajemen data seluruh dokter di RSUD Ngawi.
      </p>
      <div className="mt-8 badge badge-primary text-sm px-4 py-2">
        Segera Hadir
      </div>
    </div>
  );
}
