const {
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

async function setupServidor(guild) {

  const categoria = await guild.channels.create({
    name: "LIVEPIX",
    type: ChannelType.GuildCategory
  });

  const fila = await guild.channels.create({
    name: "🎮┃fila",
    type: ChannelType.GuildText,
    parent: categoria.id
  });

  const historico = await guild.channels.create({
    name: "📜┃historico",
    type: ChannelType.GuildText,
    parent: categoria.id
  });

  const ranking = await guild.channels.create({
    name: "🏆┃ranking",
    type: ChannelType.GuildText,
    parent: categoria.id
  });

  const comandos = await guild.channels.create({
    name: "🤖┃comandos",
    type: ChannelType.GuildText,
    parent: categoria.id
  });

  const admin = await guild.channels.create({
    name: "⚙️┃admin",
    type: ChannelType.GuildText,
    parent: categoria.id,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      }
    ]
  });

  return {
    categoria,
    fila,
    historico,
    ranking,
    comandos,
    admin
  };
}

module.exports = setupServidor;