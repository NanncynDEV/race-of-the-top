const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Prueba de conexión con PostgreSQL
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS fecha_servidor");

    res.json({
      ok: true,
      mensaje: "Conexión con PostgreSQL correcta",
      fecha: result.rows[0].fecha_servidor
    });
  } catch (error) {
    console.error("Error PostgreSQL:", error);

    res.status(500).json({
      ok: false,
      mensaje: "No fue posible conectar con PostgreSQL"
    });
  }
});

app.get("/api/test", (req, res) => {
  res.json({
    ok: true,
    mensaje: "API Race To The Top funcionando"
  });
});

app.listen(PORT, () => {
  console.log(`Race To The Top 2026 ejecutándose en puerto ${PORT}`);
});