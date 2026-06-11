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

// Jembatan TCP utama ke SawitDB Server
func eksekusiSawitDB(query string) (string, error) {
	conn, err := net.Dial("tcp", "127.0.0.1:7878")
	if err != nil {
		return "", err
	}
	defer conn.Close()

	reader := bufio.NewReader(conn)

	// Sesuai protokol v3.0, arahkan ke wilayah pasar_sawit terlebih dahulu
	fmt.Fprintf(conn, "MASUK WILAYAH pasar_sawit\n")
	_, _ = reader.ReadString('\n') 

	// Kirim perintah utama (AQL / SQL Generic)
	fmt.Fprintf(conn, query+"\n")

	response, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}

	return strings.TrimSpace(response), nil
}

func main() {
	if len(os.Args) < 2 || os.Args[1] != "http" {
		fmt.Println("❌ Error: Jalankan dengan 'go run cmd/main.go http'")
		return
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{AllowOrigins: "http://localhost:3000"}))

	// -----------------------------------------------------------------
	// 📑 AREA BAGI TUGAS ENDPOINT (Kamu & Temanmu tinggal isi logika di sini)
	// -----------------------------------------------------------------

	// [TUGAS A] - READ (PANEN DATA)
	app.Get("/api/produk", func(c *fiber.Ctx) error {
		// Menggunakan Generic SQL
		hasil, err := eksekusiSawitDB("SELECT * FROM products ORDER BY id DESC")
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "data": hasil})
	})

	// [TUGAS B] - CREATE (TANAM DATA)
	app.Post("/api/produk", func(c *fiber.Ctx) error {
		// TODO: Ambil data nama & harga dari body request json
		// Contoh query statis menggunakan AQL Pertanian:
		query := "TANAM KE products (name, price) BIBIT ('Sawit Hasil Olahan', 9000)"
		
		hasil, err := eksekusiSawitDB(query)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "detail": hasil})
	})

	// [TUGAS C] - UPDATE (PUPUK DATA)
	app.Put("/api/produk/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		// Menggunakan AQL: PUPUK [lahan] DENGAN [field=value] DIMANA [kondisi]
		query := fmt.Sprintf("PUPUK products DENGAN price=12000 DIMANA id=%s", id)

		hasil, err := eksekusiSawitDB(query)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "detail": hasil})
	})

	// [TUGAS D] - DELETE (GUSUR DATA)
	app.Delete("/api/produk/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		// Menggunakan AQL: GUSUR DARI [lahan] DIMANA [kondisi]
		query := fmt.Sprintf("GUSUR DARI products DIMANA id=%s", id)

		hasil, err := eksekusiSawitDB(query)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"status": "gagal", "error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "sukses", "detail": hasil})
	})

	fmt.Println("🌾 Backend Prabogo Framework siap di http://localhost:8080")
	app.Listen(":8080")
}