package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// Helper koneksi TCP ke SawitDB
func eksekusiSawitDB(query string) (string, error) {
	conn, err := net.Dial("tcp", "127.0.0.1:7878")
	if err != nil {
		return "", err
	}
	defer conn.Close()

	reader := bufio.NewReader(conn)
	fmt.Fprintf(conn, "MASUK WILAYAH pasar_sawit\n") // Context database
	_, _ = reader.ReadString('\n')

	fmt.Fprintf(conn, query+"\n")
	response, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(response), nil
}

// 1. STRUCT DATA (Definisi data rekam medis pasien)
type RekamMedisRequest struct {
	NamaPasien string `json:"nama_pasien"`
	Diagnosa   string `json:"diagnosa"`
	Obat       string `json:"obat"`
}

func main() {
	if len(os.Args) < 2 || os.Args[1] != "http" {
		fmt.Println("❌ Error: Gunakan 'go run cmd/main.go http'")
		return
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{AllowOrigins: "http://localhost:3000"}))

	// =================================================================
	// IMPLEMENTASI 50% ENDPOINT (GET & POST)
	// =================================================================

	// [ENDPOINT 1]: GET - Ambil Semua Rekam Medis
	app.Get("/api/rekam-medis", func(c *fiber.Ctx) error {
		// Menggunakan Generic SQL bawaan SawitDB v3.0
		query := "SELECT * FROM rekam_medis ORDER BY id DESC"

		hasil, err := eksekusiSawitDB(query)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{
			"status": "sukses",
			"fungsi": "Mengambil seluruh riwayat kesehatan pasien",
			"data":   hasil,
		})
	})

	// [ENDPOINT 2]: POST - Tambah Rekam Medis Baru (Dinamis)
	app.Post("/api/rekam-medis", func(c *fiber.Ctx) error {
		var req RekamMedisRequest

		// Membaca input JSON dari Frontend
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"status": "gagal", "error": "Format input salah"})
		}

		// Menggunakan Bahasa Pertanian AQL untuk menanam data ke SawitDB
		queryAQL := fmt.Sprintf(
			"TANAM KE rekam_medis (nama, diagnosa, obat) BIBIT ('%s', '%s', '%s')",
			req.NamaPasien, req.Diagnosa, req.Obat,
		)

		hasil, err := eksekusiSawitDB(queryAQL)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}

		return c.JSON(fiber.Map{
			"status": "sukses",
			"fungsi": "Mencatat rekam medis baru secara permanen",
			"detail": hasil,
		})
	})

	// =================================================================
	// SISA ENDPOINT SPESIFIK (GET BY ID, SEARCH, PUT, & ANALYTICS)
	// =================================================================

	// [ENDPOINT 3]: GET - Cari Rekam Medis Berdasarkan ID Pasien
	// Fungsi: Mengambil rekam medis spesifik untuk melihat detail satu riwayat.
	app.Get("/api/rekam-medis/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		// Menggunakan Generic SQL Mode
		query := fmt.Sprintf("SELECT * FROM rekam_medis WHERE id = %s LIMIT 1", id)

		hasil, err := eksekusiSawitDB(query)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "data": hasil})
	})

	// [ENDPOINT 4]: GET - Filter Multi-Kriteria (Tanggal, Penyakit/Diagnosa, atau Dokter)
	// Fungsi: Membantu dokter mencari riwayat berdasarkan kata kunci fleksibel.
	// Cara pakai di URL: /api/rekam-medis/cari?keyword=Magnitudo
	app.Get("/api/rekam-medis/cari", func(c *fiber.Ctx) error {
		keyword := c.Query("keyword")
		if keyword == "" {
			return c.Status(400).JSON(fiber.Map{"status": "gagal", "error": "Parameter keyword harus diisi"})
		}

		// Menggunakan Fitur BLUSUKAN (Full-Text Search v3.0) bawaan SawitDB!
		// Sangat cocok untuk mencari keyword di kolom mana saja secara cepat
		queryBlusukan := fmt.Sprintf("BLUSUKAN KE rekam_medis CARI \"%s\"", keyword)

		hasil, err := eksekusiSawitDB(queryBlusukan)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "hasil_pencarian": hasil})
	})

	// [ENDPOINT 5]: PUT - Update Catatan Medis (PUPUK DATA)
	// Fungsi: Mengubah resep/diagnosa pada rekam medis yang salah ketik atau diperbarui di hari yang sama.
	app.Put("/api/rekam-medis/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var req RekamMedisRequest

		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"status": "gagal", "error": "Format input salah"})
		}

		// Menggunakan Bahasa Pertanian AQL: PUPUK [lahan] DENGAN [field=value] DIMANA [kondisi]
		queryAQL := fmt.Sprintf(
			"PUPUK rekam_medis DENGAN diagnosa='%s', obat='%s' DIMANA id=%s",
			req.Diagnosa, req.Obat, id,
		)

		hasil, err := eksekusiSawitDB(queryAQL)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "detail": hasil})
	})

	// [ENDPOINT 6]: GET - Simplified Data Kinerja (HITUNG AGGREGATION)
	// Fungsi: Menampilkan data analitik ringkas (Berapa kali dokter menangani pasien) untuk penilaian kinerja.
	app.Get("/api/analitik/kinerja-dokter", func(c *fiber.Ctx) error {
		// Menggunakan fitur HITUNG COUNT & KELOMPOK (Group By) v3.0 SawitDB
		// Anggap di tabel rekam_medis kamu besok ditambahkan kolom 'dokter'
		queryAnalitik := "HITUNG COUNT(nama) DARI rekam_medis KELOMPOK dokter"

		hasil, err := eksekusiSawitDB(queryAnalitik)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{
			"status":  "sukses",
			"info":    "Total pasien yang ditangani per masing-masing dokter",
			"kinerja": hasil,
		})
	})

	fmt.Println("🌾 Backend Prabogo untuk Rekam Medis siap di http://localhost:8080")
	app.Listen(":8080")
}
