// Memanggil class SawitServer langsung dari library yang di-install via npm
// ✅ Bungkus dengan kurung kurawal { SawitServer }
// 💡 Jalur alternatif langsung ke file server utamanya
const SawitServer = require('@wowoengine/sawitdb/src/SawitServer');
const path = require('path');
require('dotenv').config(); // Membaca file .env

const port = process.env.PORT || 7878;
const dbPath = path.join(__dirname, '../data/pasar_sawit.sawit');

// Menjalankan server database pada port 7878
const server = new SawitServer(dbPath, { port: parseInt(port) });
server.start();