const connection = require("../database/connection");

async function salvar(config) {

  await connection.query(
    `
    INSERT INTO servidores (
      guild_id,
      canal_fila,
      canal_historico,
      canal_ranking,
      canal_comandos,
      canal_admin
    )
    VALUES ($1,$2,$3,$4,$5,$6)

    ON CONFLICT (guild_id)

    DO UPDATE SET
      canal_fila = EXCLUDED.canal_fila,
      canal_historico = EXCLUDED.canal_historico,
      canal_ranking = EXCLUDED.canal_ranking,
      canal_comandos = EXCLUDED.canal_comandos,
      canal_admin = EXCLUDED.canal_admin
    `,
    [
      config.guild_id,
      config.canal_fila,
      config.canal_historico,
      config.canal_ranking,
      config.canal_comandos,
      config.canal_admin
    ]
  );
}

async function buscar(guildId) {

  const { rows } = await connection.query(
    `
    SELECT *
    FROM servidores
    WHERE guild_id = $1
    `,
    [guildId]
  );

  return rows[0];
}

module.exports = {
  salvar,
  buscar
};