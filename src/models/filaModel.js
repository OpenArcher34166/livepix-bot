const connection = require("../database/connection");

// =========================
// ADICIONAR JOGADOR
// =========================
async function adicionarJogador(guildId, nome, id, valor, partidas, credito = 0) {
  await connection.query(
  `INSERT INTO fila (
    guild_id,
    nome_pix,
    id_freefire,
    valor,
    partidas,
    saldo_credito
  )
  VALUES ($1, $2, $3, $4, $5, $6)`,
  [
    guildId,
    nome,
    id,
    valor || 0,
    partidas,
    credito
  ]
);
}

// =========================
// LISTAR FILA
// =========================
async function listarFila(guildId) {
  const { rows } = await connection.query(
    `
    SELECT *
    FROM fila
    WHERE guild_id = $1
  
    ORDER BY data_doacao ASC
    `,
    [guildId]
  );

  return rows;
}

// =========================
// BUSCAR POR ID
// =========================
async function buscarPorIdFF(guildId, id) {
  const { rows } = await connection.query(
    `
    SELECT *
    FROM fila
    WHERE guild_id = $1
    AND id_freefire = $2
    `,
    [guildId, id]
  );

  return rows[0];
}

// =========================
// ATUALIZAR COMPLETO
// =========================
async function atualizarJogador(id, partidas, credito, valorExtra = 0, guildId) {
  await connection.query(
    `
    UPDATE fila
    SET partidas = $1,
        saldo_credito = $2,
        valor = valor + $3
    WHERE id_freefire = $4
    AND guild_id = $5
    `,
    [ partidas, credito, valorExtra, id, guildId]
  );
}

// =========================
// REMOVER PARTIDAS
// =========================
async function removerPartidas(id, qtd, guildId) {
  await connection.query(
    `
    UPDATE fila 
    SET partidas = GREATEST(partidas - $1, 0)
    WHERE id_freefire = $2
    AND guild_id = $3    `,
    [qtd, id, guildId]
  );
}

// =========================
// ADICIONAR PARTIDAS
// =========================
async function adicionarPartidas(guildId, id, qtd) {
  await connection.query(
    `
    UPDATE fila 
    SET partidas = partidas + $1
    WHERE id_freefire = $2
    AND guild_id = $3
    `,
    [qtd, id, guildId]
  );
}

// =========================
// FINALIZAR
// =========================
async function finalizarJogador(id, guildId) {
  await connection.query(
    `UPDATE fila SET status = 'FINALIZADO' WHERE id_freefire = $1
    AND guild_id = $2`,
    [id, guildId]
  );
}

// =========================
// RENOMEAR ID
// =========================
async function renomearId(guildId, a, b) {
  await connection.query(
    `UPDATE fila SET id_freefire = $1 WHERE id_freefire = $2
    AND guild_id = $3`,
    [b, a, guildId]
  );
}

// =========================
// RESET
// =========================
async function resetFila(guildId) {
  await connection.query(
    `
    DELETE FROM fila
    WHERE guild_id = $1
    
    `,
    [guildId]
  );
}

// =========================
// TOP DOADORES
// =========================
async function topDoadores(guildId){
  const { rows } = await connection.query(`
  SELECT
    nome_pix,
    id_freefire,
    SUM(valor) AS total
  FROM fila
  WHERE guild_id = $1
  
  GROUP BY id_freefire, nome_pix
  ORDER BY total DESC
  LIMIT 10
`,
[guildId]);

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