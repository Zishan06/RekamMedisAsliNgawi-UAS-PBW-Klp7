package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// ─── Helper koneksi TCP ke SawitDB ────────────────────────────────────────────
func eksekusiSawitDB(query string) (interface{}, error) {
	conn, err := net.Dial("tcp", "127.0.0.1:7878")
	if err != nil {
		return nil, fmt.Errorf("SawitDB tidak dapat dihubungi (port 7878): %w", err)
	}
	defer conn.Close()

	reader := bufio.NewReader(conn)

	// Baca welcome message
	_, _ = reader.ReadString('\n')

	// Helper to send request
	sendRequest := func(reqType string, payload map[string]interface{}) error {
		req := map[string]interface{}{
			"type":    reqType,
			"payload": payload,
		}
		data, _ := json.Marshal(req)
		_, err := fmt.Fprintf(conn, "%s\n", data)
		return err
	}

	// Masuk Wilayah
	if err := sendRequest("use", map[string]interface{}{"database": "rekam_medis_ngawi"}); err != nil {
		return nil, err
	}
	// Baca respons use
	_, _ = reader.ReadString('\n')

	// Kirim Query
	if err := sendRequest("query", map[string]interface{}{"query": query}); err != nil {
		return nil, err
	}

	response, err := reader.ReadString('\n')
	if err != nil {
		return nil, fmt.Errorf("Gagal membaca respons SawitDB: %w", err)
	}

	var respData struct {
		Type   string      `json:"type"`
		Result interface{} `json:"result"`
		Error  string      `json:"error"`
	}

	if err := json.Unmarshal([]byte(response), &respData); err != nil {
		return nil, fmt.Errorf("Gagal decode respons: %w", err)
	}

	if respData.Type == "error" {
		return nil, fmt.Errorf("SawitDB Error: %s", respData.Error)
	}

	return respData.Result, nil
}

// ─── Struct Request ───────────────────────────────────────────────────────────

type RekamMedisRequest struct {
	PasienID   int    `json:"pasien_id"`
	DokterID   int    `json:"dokter_id"`
	Tanggal    string `json:"tanggal"`
	Poli       string `json:"poli"`
	Diagnosa   string `json:"diagnosa"`
	ICD10      string `json:"icd10"`
	Anamnesis  string `json:"anamnesis"`
	Pemeriksaan string `json:"pemeriksaan"`
	Obat       string `json:"obat"`
	Tindakan   string `json:"tindakan"`
	Status     string `json:"status"`
}

type PasienRequest struct {
	NoRM      string `json:"no_rm"`
	Nama      string `json:"nama"`
	NIK       string `json:"nik"`
	JK        string `json:"jk"`
	TglLahir  string `json:"tgl_lahir"`
	GolDarah  string `json:"gol_darah"`
	NoHP      string `json:"no_hp"`
	Alamat    string `json:"alamat"`
	Status    string `json:"status"`
}

// ─── Main ─────────────────────────────────────────────────────────────────────
func main() {
	if len(os.Args) < 2 || os.Args[1] != "http" {
		fmt.Println("❌ Gunakan: go run cmd/main.go http")
		return
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status": "gagal",
				"error":  err.Error(),
			})
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,http://localhost:3001",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// ─────────────────────────────────────────────────────────────────────
	// ROOT: health check
	// ─────────────────────────────────────────────────────────────────────
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "online",
			"service": "Backend Prabogo — RME RSUD Ngawi",
			"version": "2.0.0",
			"endpoints": []string{
				"GET  /api/rekam-medis",
				"POST /api/rekam-medis",
				"GET  /api/rekam-medis/cari?keyword=...",
				"GET  /api/rekam-medis/:id",
				"PUT  /api/rekam-medis/:id",
				"GET  /api/pasien",
				"POST /api/pasien",
				"GET  /api/pasien/:id",
				"GET  /api/dokter",
				"GET  /api/perawat",
				"GET  /api/analitik/kinerja-dokter",
			},
		})
	})

	// ─────────────────────────────────────────────────────────────────────
	// REKAM MEDIS
	// ─────────────────────────────────────────────────────────────────────

	// [GET] Ambil semua rekam medis
	app.Get("/api/rekam-medis", func(c *fiber.Ctx) error {
		hasil, err := eksekusiSawitDB("PANEN * DARI rekam_medis")
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{
			"status": "sukses",
			"data":   hasil,
		})
	})

	// ⚠️  BUG FIX: /cari HARUS didaftarkan SEBELUM /:id
	// [GET] Cari rekam medis berdasarkan keyword (full-text search)
	// Contoh: /api/rekam-medis/cari?keyword=Hipertensi
	app.Get("/api/rekam-medis/cari", func(c *fiber.Ctx) error {
		keyword := c.Query("keyword")
		if keyword == "" {
			return c.Status(400).JSON(fiber.Map{
				"status": "gagal",
				"error":  "Parameter 'keyword' harus diisi. Contoh: /api/rekam-medis/cari?keyword=Hipertensi",
			})
		}
		queryBlusukan := fmt.Sprintf(`BLUSUKAN KE rekam_medis CARI "%s"`, keyword)
		hasil, err := eksekusiSawitDB(queryBlusukan)
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{
			"status":          "sukses",
			"keyword":         keyword,
			"hasil_pencarian": hasil,
		})
	})

	// [GET] Ambil rekam medis berdasarkan ID
	app.Get("/api/rekam-medis/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		hasil, err := eksekusiSawitDB(fmt.Sprintf("PANEN * DARI rekam_medis DIMANA id = %s", id))
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "data": hasil})
	})

	// [POST] Tambah rekam medis baru
	app.Post("/api/rekam-medis", func(c *fiber.Ctx) error {
		var req RekamMedisRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"status": "gagal", "error": "Format JSON tidak valid"})
		}
		if req.PasienID == 0 || req.DokterID == 0 || req.Tanggal == "" || req.Diagnosa == "" {
			return c.Status(400).JSON(fiber.Map{
				"status": "gagal",
				"error":  "Field wajib: pasien_id, dokter_id, tanggal, diagnosa",
			})
		}

		queryAQL := fmt.Sprintf(
			`TANAM KE rekam_medis (pasien_id, dokter_id, tanggal, poli, diagnosa, icd10, anamnesis, pemeriksaan, obat, tindakan, status) BIBIT (%d, %d, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')`,
			req.PasienID, req.DokterID, req.Tanggal, req.Poli, req.Diagnosa,
			req.ICD10, req.Anamnesis, req.Pemeriksaan, req.Obat, req.Tindakan, req.Status,
		)

		hasil, err := eksekusiSawitDB(queryAQL)
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.Status(201).JSON(fiber.Map{
			"status":  "sukses",
			"pesan":   "Rekam medis baru berhasil dicatat",
			"detail":  hasil,
		})
	})

	// [PUT] Update rekam medis berdasarkan ID
	app.Put("/api/rekam-medis/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var req RekamMedisRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"status": "gagal", "error": "Format JSON tidak valid"})
		}

		queryAQL := fmt.Sprintf(
			`PUPUK rekam_medis DENGAN diagnosa='%s', icd10='%s', obat='%s', tindakan='%s', status='%s' DIMANA id=%s`,
			req.Diagnosa, req.ICD10, req.Obat, req.Tindakan, req.Status, id,
		)

		hasil, err := eksekusiSawitDB(queryAQL)
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{
			"status": "sukses",
			"pesan":  "Rekam medis berhasil diperbarui",
			"detail": hasil,
		})
	})

	// ─────────────────────────────────────────────────────────────────────
	// PASIEN
	// ─────────────────────────────────────────────────────────────────────

	// [GET] Ambil semua pasien
	app.Get("/api/pasien", func(c *fiber.Ctx) error {
		hasil, err := eksekusiSawitDB("PANEN * DARI pasien")
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "data": hasil})
	})

	// [GET] Ambil pasien berdasarkan ID beserta rekam medisnya
	app.Get("/api/pasien/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		pasien, err := eksekusiSawitDB(fmt.Sprintf("PANEN * DARI pasien DIMANA id = %s", id))
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}

		riwayat, err := eksekusiSawitDB(fmt.Sprintf("PANEN * DARI rekam_medis DIMANA pasien_id = %s", id))
		if err != nil {
			riwayat = []interface{}{}
		}

		return c.JSON(fiber.Map{
			"status":   "sukses",
			"pasien":   pasien,
			"riwayat":  riwayat,
		})
	})

	// [POST] Tambah pasien baru
	app.Post("/api/pasien", func(c *fiber.Ctx) error {
		var req PasienRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(400).JSON(fiber.Map{"status": "gagal", "error": "Format JSON tidak valid"})
		}
		if req.Nama == "" || req.NIK == "" {
			return c.Status(400).JSON(fiber.Map{
				"status": "gagal",
				"error":  "Field wajib: nama, nik",
			})
		}
		if req.Status == "" {
			req.Status = "Aktif"
		}

		queryAQL := fmt.Sprintf(
			`TANAM KE pasien (no_rm, nama, nik, jk, tgl_lahir, gol_darah, no_hp, alamat, status) BIBIT ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')`,
			req.NoRM, req.Nama, req.NIK, req.JK, req.TglLahir,
			req.GolDarah, req.NoHP, req.Alamat, req.Status,
		)

		hasil, err := eksekusiSawitDB(queryAQL)
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.Status(201).JSON(fiber.Map{
			"status": "sukses",
			"pesan":  "Data pasien baru berhasil didaftarkan",
			"detail": hasil,
		})
	})

	// ─────────────────────────────────────────────────────────────────────
	// DOKTER & PERAWAT (read-only via backend)
	// ─────────────────────────────────────────────────────────────────────

	// [GET] Ambil semua dokter
	app.Get("/api/dokter", func(c *fiber.Ctx) error {
		hasil, err := eksekusiSawitDB("PANEN * DARI dokter")
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "data": hasil})
	})

	// [GET] Ambil semua perawat
	app.Get("/api/perawat", func(c *fiber.Ctx) error {
		hasil, err := eksekusiSawitDB("PANEN * DARI perawat")
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "data": hasil})
	})

	// ─────────────────────────────────────────────────────────────────────
	// ANALITIK
	// ─────────────────────────────────────────────────────────────────────

	// [GET] Statistik: jumlah rekam medis per dokter
	app.Get("/api/analitik/kinerja-dokter", func(c *fiber.Ctx) error {
		hasil, err := eksekusiSawitDB("HITUNG COUNT(id) DARI rekam_medis KELOMPOK dokter_id")
		if err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{
			"status":  "sukses",
			"info":    "Jumlah kasus yang ditangani per dokter",
			"kinerja": hasil,
		})
	})

	// ─────────────────────────────────────────────────────────────────────
	fmt.Println("🏥 Backend Prabogo — RME RSUD Ngawi siap di http://localhost:8080")
	fmt.Println("📋 Endpoint tersedia:")
	fmt.Println("   GET  /api/rekam-medis")
	fmt.Println("   POST /api/rekam-medis")
	fmt.Println("   GET  /api/rekam-medis/cari?keyword=...")
	fmt.Println("   GET  /api/rekam-medis/:id")
	fmt.Println("   PUT  /api/rekam-medis/:id")
	fmt.Println("   GET  /api/pasien")
	fmt.Println("   POST /api/pasien")
	fmt.Println("   GET  /api/pasien/:id")
	fmt.Println("   GET  /api/dokter")
	fmt.Println("   GET  /api/perawat")
	fmt.Println("   GET  /api/analitik/kinerja-dokter")
	app.Listen(":8080")
}
