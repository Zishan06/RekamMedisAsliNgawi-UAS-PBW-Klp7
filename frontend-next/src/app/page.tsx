'use client';

import { useEffect, useState } from 'react';

export default function DashboardKebun() {
    const [logData, setLogData] = useState<string>('Belum ada aktivitas panen.');
    const [statusSistem, setStatusSistem] = useState<string>('Menghubungkan ke Prabogo...');

    const jalankanAksi = async (metode: string, urlExtension: string = '') => {
        setStatusSistem('Memproses perintah ke backend...');
        try {
            const res = await fetch(`http://localhost:8080/api/produk${urlExtension}`, { method: metode });
            const hasil = await res.json();
            setLogData(JSON.stringify(hasil, null, 2));
            setStatusSistem('Sistem Normal - Operasi Sukses');
        } catch (err) {
            setLogData('Koneksi terputus.');
            setStatusSistem('❌ Gangguan Server Backend');
        }
    };

    useEffect(() => {
        jalankanAksi('GET');
    }, []);

    return (
        <main className="min-h-screen bg-[#121212] text-gray-100 font-mono p-8">
            {/* HEADER UTAMA */}
            <header className="max-w-5xl mx-auto border-b border-zinc-800 pb-4 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-emerald-500 tracking-tight">🚜 SAWIT-CORE MANAGEMENT SYSTEM</h1>
                    <p className="text-xs text-zinc-500 mt-1">Teknologi Sat-Set Anti-Korupsi Data Berbasis Kerakyatan</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-right">
                    <span className="text-[10px] block text-zinc-500 font-sans">STATUS SISTEM</span>
                    <span className="text-xs font-bold text-yellow-400">{statusSistem}</span>
                </div>
            </header>

            {/* DASHBOARD GRID */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* KANAN: AREA SECTION BAGI TUGAS INTERFACE UI */}
                <section className="lg:col-span-1 space-y-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">// Panel Kontrol Lahan</h2>

                        <div className="space-y-3">
                            {/* SECTION TUGAS 1: Create */}
                            <button
                                onClick={() => jalankanAksi('POST')}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition duration-200"
                            >
                                🌱 [POST] TANAM BIBIT BARU
                            </button>

                            {/* SECTION TUGAS 2: Read */}
                            <button
                                onClick={() => jalankanAksi('GET')}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-emerald-400 py-3 rounded-xl font-bold transition duration-200 border border-zinc-700"
                            >
                                🌾 [GET] PANEN RAYA (REFRESH)
                            </button>

                            {/* SECTION TUGAS 3: Update (Mock ID: 1) */}
                            <button
                                onClick={() => jalankanAksi('PUT', '/1')}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-yellow-400 py-3 rounded-xl font-bold transition duration-200 border border-zinc-700"
                            >
                                🧪 [PUT] PUPUK HARGA LAHAN ID: 1
                            </button>

                            {/* SECTION TUGAS 4: Delete (Mock ID: 1) */}
                            <button
                                onClick={() => jalankanAksi('DELETE', '/1')}
                                className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-400 py-3 rounded-xl font-bold transition duration-200 border border-red-900/50"
                            >
                                🪓 [DELETE] GUSUR LAHAN ID: 1
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 text-[11px] text-zinc-500 leading-relaxed font-sans">
                        💡 <b>Tips Kerja Kelompok:</b> Developer A fokus di file <code>main.go</code> untuk ngerjain logic data, Developer B fokus dekorasi komponen UI pake Tailwind CSS di file <code>page.tsx</code> ini.
                    </div>
                </section>

                {/* KIRI: MONITOR OUTPUT LOG RAW */}
                <section className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">// Terminal Output (SawitDB JSON)</h2>
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>

                    <pre className="bg-black border border-zinc-800 p-4 rounded-xl flex-1 text-xs text-green-400 font-mono overflow-auto max-h-[400px] shadow-inner whitespace-pre-wrap">
                        {logData}
                    </pre>
                </section>

            </div>
        </main>
    );
}