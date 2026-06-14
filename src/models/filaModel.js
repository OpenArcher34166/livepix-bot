const connection = require("../database/connection");

// =========================
// ADICIONAR JOGADOR
// =========================
async function adicionarJogador(nome, id, valor, partidas) {
  await connection.execute(
    `INSERT INTO fila (nome_pix, id_freefire, valor, partidas, saldo_credito)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, id, valor || 0, partidas, 0]
  );
}

// =========================
// LISTAR FILA
// =========================
async function listarFila() {
  const [rows] = await connection.execute(
    `SELECT * FROM fila ORDER BY data_doacao ASC`
  );
  return rows;
}

// =========================
// BUSCAR POR ID
// =========================
async function buscarPorIdFF(id) {
  const [rows] = await connection.execute(
    `SELECT * FROM fila WHERE id_freefire = ?`,
    [id]
  );
  return rows[0];
}

// =========================
// ATUALIZAR COMPLETO (PARTIDAS + CRÉDITO)
// =========================
async function atualizarJogador(id, partidas, credito, valorExtra = 0) {
  await connection.execute(
    `
    UPDATE fila
    SET partidas = ?,
        saldo_credito = ?,
        valor = valor + ?
    WHERE id_freefire = ?
    `,
    [partidas, credito, valorExtra, id]
  );
}

// =========================
// REMOVER PARTIDAS
// =========================
async function removerPartidas(id, qtd) {
  await connection.execute(
    `UPDATE fila 
     SET partidas = GREATEST(partidas - ?, 0)
     WHERE id_freefire = ?`,
    [qtd, id]
  );
}

// =========================
// ADICIONAR PARTIDAS
// =========================
async function adicionarPartidas(id, qtd) {
  await connection.execute(
    `UPDATE fila 
     SET partidas = partidas + ?
     WHERE id_freefire = ?`,
    [qtd, id]
  );
}

// =========================
// FINALIZAR
// =========================
async function finalizarJogador(id) {
  await connection.execute(
    `UPDATE fila SET status = 'FINALIZADO' WHERE id_freefire = ?`,
    [id]
  );
}

// =========================
// RENOMEAR ID
// =========================
async function renomearId(a, b) {
  await connection.execute(
    `UPDATE fila SET id_freefire = ? WHERE id_freefire = ?`,
    [b, a]
  );
}

// =========================
// RESET
// =========================
async function resetFila() {
  await connection.execute(`DELETE FROM fila`);
}

// =========================
// TOP DOADORES
// =========================
async function topDoadores() {
  const [rows] = await connection.execute(`
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