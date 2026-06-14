const pool = require("./src/database/connection");

async function testar() {
  try {
    const [rows] = await pool.query("SELECT VERSION() AS versao");
    console.log(rows);
  } catch (erro) {
    console.error("ERRO:", erro.message);
  }
}

testar();