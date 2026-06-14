function hasPermission(message, level = "USER") {
  const roles = message.member?.roles?.cache;

  if (!roles) return false;

  if (level === "USER") return true;

  if (level === "MOD") {
    return (
      roles.some(r => r.name === "MOD") ||
      roles.some(r => r.name === "ADMIN")
    );
  }

  if (level === "ADMIN") {
    return roles.some(r => r.name === "ADMIN");
  }

  return false;
}

module.exports = hasPermission;