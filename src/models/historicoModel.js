const connection = require("../database/connection");

async function registrar(
  guildId,
  acao,
  nomePix,
  idFreeFire,
  valor = 0,
  partidas = 0
) {
await connection.query(
`
INSERT INTO historico
(
  guild_id,
  acao,
  nome_pix,
  id_freefire,
  valor,
  partidas
)
VALUES ($1,$2,$3,$4,$5,$6)
`,
[
  guildId,
  acao,
  nomePix,
  idFreeFire,
  valor,
  partidas
]
);
}

async function listarHistorico() {
  const { rows } = await connection.query(`
    SELECT *
    FROM historico
    ORDER BY criado_em DESC
    LIMIT 50
  `);

  return rows;
}

module.exports = {
  registrar,
  listarHistorico
};