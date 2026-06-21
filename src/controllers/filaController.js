const filaService = require("../services/filaService");

module.exports = {
  adicionar: (guildId, nome, id, valor) =>
    filaService.adicionar(guildId, nome, id, valor),

  adicionarManual: (guildId, nome, id, partidas) =>
    filaService.adicionarManual(guildId, nome, id, partidas),

  listar: (guildId) =>
    filaService.listar(guildId),

  jogar: (guildId, id) =>
    filaService.jogar(guildId, id),

  renomear: (guildId, a, b) =>
    filaService.renomear(guildId, a, b),

  topDoadores: (guildId) =>
    filaService.topDoadores(guildId),

  addPartidas: (guildId, id, qtd) =>
    filaService.addPartidas(guildId, id, qtd),

  remPartidas: (guildId, id, qtd) =>
    filaService.remPartidas(guildId, id, qtd),

  info: (guildId, id) =>
    filaService.info(guildId, id),

  reset: (guildId) =>
    filaService.reset(guildId)
};