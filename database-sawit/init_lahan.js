/**
 * init_lahan.js
 * Setup awal SawitDB untuk Sistem Rekam Medis Elektronik (RME) RSUD Ngawi.
 *
 * Lahan yang dibuat:
 *  - dokter   : Data dokter & spesialisasi
 *  - perawat  : Data perawat & ruangan
 *  - pasien   : Data identitas pasien
 *  - rekam_medis : Catatan medis yang menghubungkan pasien + dokter
 *
 * Jalankan: node init_lahan.js
 */

const SawitDB = require('@wowoengine/sawitdb');
const path = require('path');
const fs = require('fs');

async function initDatabase() {
    console.log("🏥 ================================================");
    console.log("🏥  Inisialisasi Database RME — RSUD Ngawi");
    console.log("🏥 ================================================\n");

    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'rekam_medis_ngawi.sawit');
    const db = new SawitDB(dbPath);

    try {
        // ============================================================
        // LANGKAH 1: BUAT SEMUA LAHAN (TABEL)
        // ============================================================
        console.log("📋 [1/5] Membuat struktur lahan (tabel)...");

        await db.query("LAHAN dokter");
        console.log("  ✅ Lahan 'dokter' siap.");

        await db.query("LAHAN perawat");
        console.log("  ✅ Lahan 'perawat' siap.");

        await db.query("LAHAN pasien");
        console.log("  ✅ Lahan 'pasien' siap.");

        await db.query("LAHAN rekam_medis");
        console.log("  ✅ Lahan 'rekam_medis' siap.\n");

        // ============================================================
        // LANGKAH 2: SEED DATA DOKTER (5 dokter)
        // ============================================================
        console.log("👨‍⚕️ [2/5] Menanam data dokter...");

        const dokterList = [
            { id: 1, nama: 'dr. Budi Santoso, Sp.PD',       spesialisasi: 'Penyakit Dalam', no_sip: 'SIP-PDL-2021-001', telp: '081234567801' },
            { id: 2, nama: 'dr. Siti Rahayu, Sp.A',          spesialisasi: 'Anak',           no_sip: 'SIP-ANA-2021-002', telp: '081234567802' },
            { id: 3, nama: 'dr. Ahmad Fauzi, Sp.B',           spesialisasi: 'Bedah Umum',     no_sip: 'SIP-BDH-2021-003', telp: '081234567803' },
            { id: 4, nama: 'dr. Dewi Kartika, Sp.OG',         spesialisasi: 'Obstetri & Gin', no_sip: 'SIP-OBG-2021-004', telp: '081234567804' },
            { id: 5, nama: 'dr. Hendra Wijaya, Sp.JP',        spesialisasi: 'Jantung & P.D.', no_sip: 'SIP-JNT-2021-005', telp: '081234567805' },
        ];

        for (const d of dokterList) {
            await db.query(
                `TANAM KE dokter (id, nama, spesialisasi, no_sip, telp) BIBIT (${d.id}, '${d.nama}', '${d.spesialisasi}', '${d.no_sip}', '${d.telp}')`
            );
        }
        console.log(`  ✅ ${dokterList.length} dokter berhasil ditanam.\n`);

        // ============================================================
        // LANGKAH 3: SEED DATA PERAWAT (5 perawat)
        // ============================================================
        console.log("👩‍⚕️ [3/5] Menanam data perawat...");

        const perawatList = [
            { id: 1, nama: 'Ns. Rini Astuti, S.Kep',     ruangan: 'Poli Umum',   shift: 'Pagi',  telp: '082134567801' },
            { id: 2, nama: 'Ns. Joko Pramono, S.Kep',    ruangan: 'IGD',         shift: 'Malam', telp: '082134567802' },
            { id: 3, nama: 'Ns. Maya Sari, S.Kep',        ruangan: 'Anak',        shift: 'Pagi',  telp: '082134567803' },
            { id: 4, nama: 'Ns. Agus Setiawan, S.Kep',   ruangan: 'Bedah',       shift: 'Siang', telp: '082134567804' },
            { id: 5, nama: 'Ns. Lestari Indah, S.Kep',   ruangan: 'Kebidanan',   shift: 'Pagi',  telp: '082134567805' },
        ];

        for (const p of perawatList) {
            await db.query(
                `TANAM KE perawat (id, nama, ruangan, shift, telp) BIBIT (${p.id}, '${p.nama}', '${p.ruangan}', '${p.shift}', '${p.telp}')`
            );
        }
        console.log(`  ✅ ${perawatList.length} perawat berhasil ditanam.\n`);

        // ============================================================
        // LANGKAH 4: SEED DATA PASIEN (10 pasien)
        // ============================================================
        console.log("🧑‍🤝‍🧑 [4/5] Menanam data pasien...");

        const pasienList = [
            { id: 1,  no_rm: 'RM-2024-001', nama: 'Slamet Riyadi',      nik: '3521010101800001', jk: 'L', tgl_lahir: '1980-01-01', gol_darah: 'A',  no_hp: '085600000001', alamat: 'Jl. Diponegoro No.1, Ngawi',       status: 'Aktif'      },
            { id: 2,  no_rm: 'RM-2024-002', nama: 'Endang Sulistyowati', nik: '3521015505750002', jk: 'P', tgl_lahir: '1975-05-15', gol_darah: 'B',  no_hp: '085600000002', alamat: 'Jl. Ronggowarsito No.5, Ngawi',    status: 'Rawat Jalan' },
            { id: 3,  no_rm: 'RM-2024-003', nama: 'Bambang Suprapto',    nik: '3521011212680003', jk: 'L', tgl_lahir: '1968-12-12', gol_darah: 'O',  no_hp: '085600000003', alamat: 'Desa Karangjati, Ngawi',            status: 'Aktif'      },
            { id: 4,  no_rm: 'RM-2024-004', nama: 'Sri Mulyani',         nik: '3521015003820004', jk: 'P', tgl_lahir: '1982-03-10', gol_darah: 'AB', no_hp: '085600000004', alamat: 'Jl. Sudirman No.22, Ngawi',         status: 'Aktif'      },
            { id: 5,  no_rm: 'RM-2024-005', nama: 'Wahyu Triyanto',      nik: '3521011507900005', jk: 'L', tgl_lahir: '1990-07-15', gol_darah: 'A',  no_hp: '085600000005', alamat: 'Jl. Veteran No.10, Ngawi',          status: 'Rawat Inap'  },
            { id: 6,  no_rm: 'RM-2024-006', nama: 'Ratna Dewi',          nik: '3521012005880006', jk: 'P', tgl_lahir: '1988-05-20', gol_darah: 'B',  no_hp: '085600000006', alamat: 'Desa Paron, Kec. Paron, Ngawi',    status: 'Aktif'      },
            { id: 7,  no_rm: 'RM-2024-007', nama: 'Haryono Kusuma',      nik: '3521010808650007', jk: 'L', tgl_lahir: '1965-08-08', gol_darah: 'O',  no_hp: '085600000007', alamat: 'Jl. Ki Hajar Dewantara No.3, Ngawi', status: 'Aktif'      },
            { id: 8,  no_rm: 'RM-2024-008', nama: 'Yuli Astuti',         nik: '3521012511920008', jk: 'P', tgl_lahir: '1992-11-25', gol_darah: 'A',  no_hp: '085600000008', alamat: 'Kel. Margomulyo, Ngawi',            status: 'Aktif'      },
            { id: 9,  no_rm: 'RM-2024-009', nama: 'Eko Prasetyo',        nik: '3521010204850009', jk: 'L', tgl_lahir: '1985-04-02', gol_darah: 'AB', no_hp: '085600000009', alamat: 'Jl. Basuki Rahmat No.7, Ngawi',     status: 'Rawat Jalan' },
            { id: 10, no_rm: 'RM-2024-010', nama: 'Iin Wulandari',       nik: '3521014409950010', jk: 'P', tgl_lahir: '1995-09-04', gol_darah: 'B',  no_hp: '085600000010', alamat: 'Desa Ngawi Purba, Ngawi',           status: 'Aktif'      },
        ];

        for (const p of pasienList) {
            await db.query(
                `TANAM KE pasien (id, no_rm, nama, nik, jk, tgl_lahir, gol_darah, no_hp, alamat, status) BIBIT (${p.id}, '${p.no_rm}', '${p.nama}', '${p.nik}', '${p.jk}', '${p.tgl_lahir}', '${p.gol_darah}', '${p.no_hp}', '${p.alamat}', '${p.status}')`
            );
        }
        console.log(`  ✅ ${pasienList.length} pasien berhasil ditanam.\n`);

        // ============================================================
        // LANGKAH 5: SEED DATA REKAM MEDIS (20 rekaman)
        // ============================================================
        console.log("📝 [5/5] Menanam data rekam medis...");

        const rekamMedisList = [
            // pasien_id, dokter_id, tanggal, poli, diagnosa, icd10, anamnesis, pemeriksaan, obat, tindakan, status
            { id: 1,  pasien_id: 1,  dokter_id: 1, tanggal: '2024-11-01', poli: 'Penyakit Dalam', diagnosa: 'Hipertensi Esensial',      icd10: 'I10',   anamnesis: 'Pasien datang dengan keluhan sakit kepala dan pusing sejak 2 hari lalu.', pemeriksaan: 'TD: 160/100, Nadi: 82x/mnt, RR: 18x/mnt', obat: 'Amlodipine 5mg 1x1, Captopril 25mg 2x1', tindakan: 'Konsultasi, Resep obat', status: 'Selesai' },
            { id: 2,  pasien_id: 2,  dokter_id: 4, tanggal: '2024-11-03', poli: 'Kebidanan',       diagnosa: 'Pemeriksaan Kehamilan',    icd10: 'Z34.0', anamnesis: 'Kontrol kehamilan trimester pertama, G1P0A0, usia kehamilan 10 minggu.', pemeriksaan: 'TFU tidak teraba, DJJ: 148x/mnt, TD: 110/70', obat: 'Asam Folat 400mcg 1x1, Fe 60mg 1x1', tindakan: 'USG Fetomaternal, Konsultasi gizi', status: 'Selesai' },
            { id: 3,  pasien_id: 3,  dokter_id: 1, tanggal: '2024-11-05', poli: 'Penyakit Dalam', diagnosa: 'Diabetes Melitus Tipe 2',   icd10: 'E11',   anamnesis: 'Pasien rutin kontrol DM, sering merasa haus dan lapar, berat badan turun.', pemeriksaan: 'GDS: 285 mg/dL, TD: 130/85, BMI: 28.5', obat: 'Metformin 500mg 2x1, Glibenclamide 5mg 1x1 (pagi)', tindakan: 'Cek GDS, Konsultasi diet', status: 'Selesai' },
            { id: 4,  pasien_id: 4,  dokter_id: 5, tanggal: '2024-11-07', poli: 'Jantung',         diagnosa: 'Angina Pektoris Stabil',   icd10: 'I20.9', anamnesis: 'Nyeri dada saat aktivitas, menjalar ke lengan kiri, membaik dengan istirahat.', pemeriksaan: 'EKG: normal sinus, TD: 140/90, Nadi: 78x/mnt', obat: 'Nitrat 5mg sublingual PRN, Bisoprolol 2.5mg 1x1', tindakan: 'EKG, Treadmill test, Konsultasi', status: 'Selesai' },
            { id: 5,  pasien_id: 5,  dokter_id: 3, tanggal: '2024-11-09', poli: 'Bedah',           diagnosa: 'Appendicitis Akut',        icd10: 'K35.9', anamnesis: 'Nyeri perut kanan bawah sejak 1 hari, mual, muntah, demam 38.5C.', pemeriksaan: 'Rovsing sign +, Psoas sign +, Leukosit: 14.000', obat: 'Ceftriaxone 1g/12 jam IV, Ketorolac 30mg/8jam IV, Metronidazole 500mg/8jam IV', tindakan: 'Appendektomi laparoskopi', status: 'Rawat Inap' },
            { id: 6,  pasien_id: 6,  dokter_id: 2, tanggal: '2024-11-10', poli: 'Anak',            diagnosa: 'Demam Berdarah Dengue',    icd10: 'A91',   anamnesis: 'Anak demam 3 hari, ruam merah di kulit, perdarahan gusi, tidak nafsu makan.', pemeriksaan: 'T: 39.2C, Trombosit: 68.000, Ht: 48%', obat: 'Paracetamol 250mg/8jam, Infus RL 30 tpm', tindakan: 'Rawat inap, Monitor trombosit/12jam', status: 'Selesai' },
            { id: 7,  pasien_id: 7,  dokter_id: 1, tanggal: '2024-11-12', poli: 'Penyakit Dalam', diagnosa: 'GERD',                     icd10: 'K21.0', anamnesis: 'Nyeri ulu hati, rasa terbakar di dada, mual, sering sendawa.', pemeriksaan: 'Nyeri tekan epigastrium, TD: 120/80', obat: 'Omeprazole 20mg 1x1 ac, Antasida Gel 3x10ml', tindakan: 'Konsultasi, Endoskopi direncanakan', status: 'Selesai' },
            { id: 8,  pasien_id: 8,  dokter_id: 4, tanggal: '2024-11-14', poli: 'Kebidanan',       diagnosa: 'Dismenore Primer',         icd10: 'N94.4', anamnesis: 'Nyeri perut hebat saat haid, sudah berlangsung 3 siklus, mengganggu aktivitas.', pemeriksaan: 'Abdomen supel, nyeri tekan suprapubik, tidak ada massa', obat: 'Asam Mefenamat 500mg 3x1, Buscopan 10mg 3x1', tindakan: 'Konsultasi, USG Ginekologi', status: 'Selesai' },
            { id: 9,  pasien_id: 9,  dokter_id: 5, tanggal: '2024-11-15', poli: 'Jantung',         diagnosa: 'Gagal Jantung Kongestif',  icd10: 'I50.0', anamnesis: 'Sesak napas saat beraktivitas, tungkai bengkak bilateral, tidur harus bantal tinggi.', pemeriksaan: 'JVP meningkat, Edema pretibial ++, Ronchi basah basal', obat: 'Furosemide 40mg 1x1, Spironolactone 25mg 1x1, Digoxin 0.25mg 1x1', tindakan: 'Rawat jalan, Foto thorax, Echocardiografi', status: 'Selesai' },
            { id: 10, pasien_id: 10, dokter_id: 2, tanggal: '2024-11-16', poli: 'Anak',            diagnosa: 'ISPA',                     icd10: 'J06.9', anamnesis: 'Batuk pilek 4 hari, demam 37.8C, tidak ada sesak napas.', pemeriksaan: 'Faring hiperemis, RR: 20x/mnt, tidak ada wheezing', obat: 'Amoxicillin 500mg 3x1, CTM 4mg 2x1, Paracetamol 500mg 3x1 PRN', tindakan: 'Konsultasi, Resep', status: 'Selesai' },
            { id: 11, pasien_id: 1,  dokter_id: 1, tanggal: '2024-11-20', poli: 'Penyakit Dalam', diagnosa: 'Hipertensi Esensial (Kontrol)', icd10: 'I10', anamnesis: 'Kontrol rutin hipertensi, sakit kepala berkurang setelah minum obat.', pemeriksaan: 'TD: 140/90, Nadi: 78x/mnt', obat: 'Amlodipine 5mg 1x1 (lanjut)', tindakan: 'Kontrol rutin', status: 'Selesai' },
            { id: 12, pasien_id: 3,  dokter_id: 1, tanggal: '2024-11-22', poli: 'Penyakit Dalam', diagnosa: 'Diabetes Melitus Tipe 2 (Kontrol)', icd10: 'E11', anamnesis: 'Kontrol DM, rasa haus berkurang, GDS terkontrol.', pemeriksaan: 'GDS: 180 mg/dL, TD: 125/80', obat: 'Metformin 500mg 2x1 (lanjut), Glibenclamide 5mg 1x1 (lanjut)', tindakan: 'Cek GDS, Kontrol diet', status: 'Selesai' },
            { id: 13, pasien_id: 5,  dokter_id: 3, tanggal: '2024-11-25', poli: 'Bedah',           diagnosa: 'Post Appendektomi hari ke-7', icd10: 'Z48.0', anamnesis: 'Kontrol luka operasi, tidak ada tanda infeksi, pemulihan baik.', pemeriksaan: 'Luka bersih, tidak ada pus, nyeri minimal', obat: 'Cefadroxil 500mg 2x1 (5 hari), Asam Mefenamat 500mg 3x1 PRN', tindakan: 'Ganti balut, Lepas jahitan direncanakan', status: 'Rawat Inap' },
            { id: 14, pasien_id: 4,  dokter_id: 5, tanggal: '2024-11-28', poli: 'Jantung',         diagnosa: 'Angina Pektoris (Kontrol)', icd10: 'I20.9', anamnesis: 'Nyeri dada berkurang dengan obat, aktivitas sehari-hari lebih baik.', pemeriksaan: 'EKG: normal, TD: 130/85', obat: 'Bisoprolol 2.5mg 1x1 (lanjut), Aspirin 100mg 1x1', tindakan: 'EKG kontrol, Konsultasi', status: 'Selesai' },
            { id: 15, pasien_id: 2,  dokter_id: 4, tanggal: '2024-11-30', poli: 'Kebidanan',       diagnosa: 'Pemeriksaan Kehamilan TM2', icd10: 'Z34.1', anamnesis: 'Kontrol kehamilan trimester kedua, usia kehamilan 24 minggu. Gerakan janin aktif.', pemeriksaan: 'TFU 24cm, DJJ: 152x/mnt, TD: 112/72, BB naik 3kg', obat: 'Fe 60mg 1x1 (lanjut), Kalsium Laktat 500mg 2x1', tindakan: 'USG, Konsultasi gizi, Kelas ibu hamil', status: 'Selesai' },
            { id: 16, pasien_id: 7,  dokter_id: 1, tanggal: '2024-12-02', poli: 'Penyakit Dalam', diagnosa: 'Dyspepsia Fungsional',     icd10: 'K30',   anamnesis: 'Mual, tidak nafsu makan, perut terasa penuh setelah makan sedikit.', pemeriksaan: 'Abdomen supel, tidak ada nyeri tekan bermakna', obat: 'Domperidone 10mg 3x1 ac, Omeprazole 20mg 1x1 ac', tindakan: 'Konsultasi', status: 'Selesai' },
            { id: 17, pasien_id: 8,  dokter_id: 4, tanggal: '2024-12-05', poli: 'Kebidanan',       diagnosa: 'Vaginitis Bakterial',      icd10: 'N76.0', anamnesis: 'Keputihan berbau, gatal, 1 minggu terakhir.', pemeriksaan: 'Discharge putih keabu-abuan, Whiff test +, pH >4.5', obat: 'Metronidazole 500mg 2x1 (7 hari), Clindamycin krim vagina', tindakan: 'Konsultasi, Pemeriksaan discharge', status: 'Selesai' },
            { id: 18, pasien_id: 9,  dokter_id: 5, tanggal: '2024-12-08', poli: 'Jantung',         diagnosa: 'Gagal Jantung (Kontrol)',  icd10: 'I50.0', anamnesis: 'Sesak napas berkurang, bengkak kaki membaik.', pemeriksaan: 'JVP normal, edema minimal, ronchi (−)', obat: 'Furosemide 40mg 1x1 (lanjut), Spironolactone 25mg 1x1 (lanjut)', tindakan: 'Echokardiografi kontrol', status: 'Selesai' },
            { id: 19, pasien_id: 10, dokter_id: 2, tanggal: '2024-12-10', poli: 'Anak',            diagnosa: 'Diare Akut Tanpa Dehidrasi', icd10: 'A09', anamnesis: 'BAB cair >5x/hari sejak kemarin, tidak ada darah, masih mau minum.', pemeriksaan: 'Turgor kulit baik, mukosa lembab, bising usus meningkat', obat: 'Oralit ad libitum, Zinc 20mg 1x1 (10 hari), L-Bio 1 sachet 2x1', tindakan: 'Edukasi rehidrasi oral', status: 'Selesai' },
            { id: 20, pasien_id: 6,  dokter_id: 2, tanggal: '2024-12-12', poli: 'Anak',            diagnosa: 'Bronkitis Akut',           icd10: 'J20.9', anamnesis: 'Batuk berdahak kuning kehijauan sejak 5 hari, demam rendah, sesak ringan.', pemeriksaan: 'RR: 26x/mnt, Ronchi basah +/+, tidak ada wheezing', obat: 'Amoxicillin-Clavulanat 500mg 3x1, Salbutamol 2mg 3x1, Ambroxol 30mg 3x1', tindakan: 'Nebulisasi Salbutamol, Konsultasi', status: 'Selesai' },
        ];

        for (const rm of rekamMedisList) {
            await db.query(
                `TANAM KE rekam_medis (id, pasien_id, dokter_id, tanggal, poli, diagnosa, icd10, anamnesis, pemeriksaan, obat, tindakan, status) BIBIT (${rm.id}, ${rm.pasien_id}, ${rm.dokter_id}, '${rm.tanggal}', '${rm.poli}', '${rm.diagnosa}', '${rm.icd10}', '${rm.anamnesis}', '${rm.pemeriksaan}', '${rm.obat}', '${rm.tindakan}', '${rm.status}')`
            );
        }
        console.log(`  ✅ ${rekamMedisList.length} rekam medis berhasil ditanam.\n`);

        // ============================================================
        // VERIFIKASI AKHIR
        // ============================================================
        console.log("🔍 Verifikasi hasil panen...");
        const hasilDokter    = await db.query("PANEN * DARI dokter");
        const hasilPerawat   = await db.query("PANEN * DARI perawat");
        const hasilPasien    = await db.query("PANEN * DARI pasien");
        const hasilRekamMedis = await db.query("PANEN * DARI rekam_medis");

        console.log(`  👨‍⚕️ Total dokter   : ${Array.isArray(hasilDokter) ? hasilDokter.length : 0}`);
        console.log(`  👩‍⚕️ Total perawat  : ${Array.isArray(hasilPerawat) ? hasilPerawat.length : 0}`);
        console.log(`  🧑  Total pasien   : ${Array.isArray(hasilPasien) ? hasilPasien.length : 0}`);
        console.log(`  📋 Total rekam medis: ${Array.isArray(hasilRekamMedis) ? hasilRekamMedis.length : 0}`);

        console.log("\n🏥 ================================================");
        console.log("🏥  Database RME Ngawi berhasil diinisialisasi!");
        console.log("🏥 ================================================");

        // Simpan data ke disk dengan menutup database
        db.close();

    } catch (error) {
        console.error("\n❌ Gagal inisialisasi database:", error.message);
        console.error(error);
        process.exit(1);
    }
}

initDatabase();