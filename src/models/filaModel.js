const connection = require("../database/connection");

// =========================
// ADICIONAR JOGADOR
// =========================
async function adicionarJogador(nome, id, valor, partidas, credito = 0) {
  await connection.query(
    `INSERT INTO fila (nome_pix, id_freefire, valor, partidas, saldo_credito)
     VALUES ($1, $2, $3, $4, $5)`,
    [nome, id, valor || 0, partidas, credito]
  );
}

// =========================
// LISTAR FILA
// =========================
async function listarFila() {
  const { rows } = await connection.query(
    `SELECT * FROM fila ORDER BY data_doacao ASC`
  );
  return rows;
}

// =========================
// BUSCAR POR ID
// =========================
async function buscarPorIdFF(id) {
  const { rows } = await connection.query(
    `SELECT * FROM fila WHERE id_freefire = $1`,
    [id]
  );
  return rows[0];
}

// =========================
// ATUALIZAR COMPLETO
// =========================
async function atualizarJogador(id, partidas, credito, valorExtra = 0) {
  await connection.query(
    `
    UPDATE fila
    SET partidas = $1,
        saldo_credito = $2,
        valor = valor + $3
    WHERE id_freefire = $4
    `,
    [partidas, credito, valorExtra, id]
  );
}

// =========================
// REMOVER PARTIDAS
// =========================
async function removerPartidas(id, qtd) {
  await connection.query(
    `
    UPDATE fila 
    SET partidas = GREATEST(partidas - $1, 0)
    WHERE id_freefire = $2
    `,
    [qtd, id]
  );
}

// =========================
// ADICIONAR PARTIDAS
// =========================
async function adicionarPartidas(id, qtd) {
  await connection.query(
    `
    UPDATE fila 
    SET partidas = partidas + $1
    WHERE id_freefire = $2
    `,
    [qtd, id]
  );
}

// =========================
// FINALIZAR
// =========================
async function finalizarJogador(id) {
  await connection.query(
    `UPDATE fila SET status = 'FINALIZADO' WHERE id_freefire = $1`,
    [id]
  );
}

// =========================
// RENOMEAR ID
// =========================
async function renomearId(a, b) {
  await connection.query(
    `UPDATE fila SET id_freefire = $1 WHERE id_freefire = $2`,
    [b, a]
  );
}

// =========================
// RESET
// =========================
async function resetFila() {
  await connection.query(`DELETE FROM fila`);
}

// =========================
// TOP DOADORES
// =========================
async function topDoadores() {
  const { rows } = await connection.query(`
    SELECT nome_pix, id_freefire, SUM(valor) AS total
    FROM fila
    GROUP BY id_freefire, nome_pix
    ORDER BY total DESC
    LIMIT 10
  `);

  return rows;
}

module.exports = {
  adicionarJogador,
  listarFila,
  buscarPorIdFF,
  atualizarJogador,
  removerPartidas,
  adicionarPartidas,
  finalizarJogador,
  renomearId,
  resetFila,
  topDoadores
};