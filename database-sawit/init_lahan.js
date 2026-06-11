const SawitDB = require('@wowoengine/sawitdb');
const path = require('path');

async function initDatabase() {
    console.log("🌾 Memulai proses pembukaan wilayah dan lahan...");
    
    // Inisialisasi engine lokal ke file pasar_sawit.sawit
    const dbPath = path.join(__dirname, 'data', 'pasar_sawit.sawit');
    const db = new SawitDB(dbPath);

    try {
        // 1. Buat Lahan (Table) jika belum ada
        console.log("🚜 Membuat LAHAN 'products'...");
        await db.query("LAHAN products"); 

        // 2. Tanam Bibit Awal (Insert Mock Data)
        console.log("🌱 Menanam BIBIT awal...");
        await db.query("TANAM KE products (name, price) BIBIT ('Kelapa Sawit Mentah', 4500)");
        await db.query("TANAM KE products (name, price) BIBIT ('Minyak Goreng CPO', 14000)");

        // 3. Tes Panen (Select Data)
        const hasil = await db.query("PANEN * DARI products");
        console.log("✨ Verifikasi Hasil Panen Awal:", hasil);
        console.log("✅ Setup Lahan SawitDB Berhasil!");
    } catch (error) {
        console.error("❌ Gagal melakukan setup database:", error);
    }
}

initDatabase();