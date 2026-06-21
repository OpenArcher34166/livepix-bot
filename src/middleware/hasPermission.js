const { PermissionFlagsBits } = require("discord.js");

function hasPermission(message, level = "USER") {

  if (level === "USER") {
    return true;
  }

  const member = message.member;

  if (!member) {
    return false;
  }

  // Dono do servidor
  if (member.id === message.guild.ownerId) {
    return true;
  }

  // Administrador do Discord
  if (
    member.permissions.has(
      PermissionFlagsBits.Administrator
    )
  ) {
    return true;
  }

  const roles = member.roles.cache;

  if (level === "MOD") {
    return (
      roles.some(r => r.name === "MOD") ||
      roles.some(r => r.name === "ADMIN")
    );
  }

  if (level === "ADMIN") {
    return roles.some(
      r => r.name === "ADMIN"
    );
  }

  return false;
}

module.exports = hasPermission;