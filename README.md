# 🌾 PANDUAN RUNNING & SETUP PROJECT (UAS PBW)
Halo Kembar! Ini repo proyek UAS kita yang menggabungkan Next.js (Frontend) + Prabogo Framework (Backend Go) + SawitDB v3.0 (Database).

Sebelum ko bisa bagi tugas dan mulai coding, berikut adalah hal-hal yang wajib ko instal dan urutan cara menjalankannya di laptop ko:

🛠️ Prerequisites (Yang Wajib Diinstal Terlebih Dahulu)
Node.js (Versi terbaru/LTS): Untuk menjalankan Frontend Next.js dan Database SawitDB.

Go (Versi >= 1.25): Sesuai syarat minimum dari Prabogo Framework untuk menjalankan engine backend kita.

# 🏃‍♂️ Langkah-Langkah Menjalankan Sistem (Wajib Urut!)
Buka *3 terminal* terpisah di VS Code ko, lalu jalankan perintah berikut secara berurutan:

## 🛢️ TERMINAL 1: Setup & Jalankan SawitDB
Kita pakai SawitDB v3.0 yang punya fitur anti-korupsi data. Kita perlu inject data benih awal dulu baru nyalain servernya.


### 1. Masuk ke folder database
```cd database-sawit```

### 2. Install library asli SawitDB
```npm install```

### 3. Jalankan skrip otomatis buat bikin Lahan & isi data awal
```node init_lahan.js```

### 4. Nyalain Server SawitDB (Standby di port 7878)
```node bin/sawit-server.js```
## 🏎️ TERMINAL 2: Jalankan Backend Prabogo (Go)
Backend ini bertugas jadi makelar/jembatan data dari Next.js menuju ke server SawitDB via koneksi TCP.

```node bin/sawit-server.js```


### 1. Masuk ke folder backend
```cd backend-prabogo```

### 2. Download/bersihkan dependensi Go otomatis
```go mod tidy```

### 3. Jalankan server HTTP bawaan Prabogo Framework
```go run cmd/main.go http```
(Patikan muncul log: Prabogo Engine aktif mengawal SawitDB di http://localhost:8080, beuhh)

## 🎨 TERMINAL 3: Jalankan Frontend Next.js
Ini tempat kita ngerjain UI/UX pakai komponen sat-set ala JokoUI dan Tailwind CSS.


### 1. Masuk ke folder frontend
```cd frontend-nextjs```

### 2. Install semua library UI & Next.js
```npm install```

### 3. Nyalain server lokal website
```npm run dev```


# 🖥️ Cara Memastikan Semuanya Aman
Buka browser ko, lalu akses ```http://localhost:3000```.

Kalau halaman dashboard monitoring kebun sudah muncul dan kotak terminal hitam di kanan sudah menampilkan data mentah JSON dari SawitDB, berarti sistem ko udah sinkron 100%!

Coba klik tombol "🌱 [POST] TANAM BIBIT BARU", kalau datanya nambah, berarti jalur Next.js ➜ Prabogo ➜ SawitDB gak ada yang bocor.

### Powered By:

<img width="1024" height="490" alt="image" src="https://github.com/user-attachments/assets/37e03dbb-1a4d-4649-a388-685cd5af02e7" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c48f473c-df80-4111-bceb-42c54242ee97" />

<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/f60ac4b3-d103-4d1f-985d-3d7eac9380ac" />

