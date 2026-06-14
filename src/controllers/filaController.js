

const filaService = require("../services/filaService");

module.exports = {
  adicionar: filaService.adicionar,
  adicionarManual: filaService.adicionarManual, // NOVO
  listar: filaService.listar,
  jogar: filaService.jogar,
  renomear: filaService.renomear,
  topDoadores: filaService.topDoadores
};