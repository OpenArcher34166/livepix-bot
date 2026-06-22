const connection = require("../database/connection");

async function obterConfiguracao(guildId) {
  const { rows } = await connection.query(
    `
    SELECT *
    FROM configuracao_servidor
    WHERE guild_id = $1
    `,
    [guildId]
  );

  return rows[0];
}

async function definirPreco(guildId, valor) {
  await connection.query(
    `
    INSERT INTO configuracao_servidor
    (guild_id, valor_partida)
    VALUES ($1, $2)

    ON CONFLICT (guild_id)
    DO UPDATE SET
    valor_partida = EXCLUDED.valor_partida
    `,
    [guildId, valor]
  );
}

module.exports = {
  obterConfiguracao,
  definirPreco
};