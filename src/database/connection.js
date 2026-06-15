const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// teste de conexão (opcional, ajuda a debugar no Render)
pool.connect()
  .then(() => {
    console.log("✅ Conectado ao banco PostgreSQL (Supabase)");
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco:", err);
  });

module.exports = pool;