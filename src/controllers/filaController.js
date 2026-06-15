const filaService = require("../services/filaService");

module.exports = {
  adicionar: (nome, id, valor) =>
    filaService.adicionar(nome, id, valor),

  adicionarManual: (nome, id, partidas) =>
    filaService.adicionarManual(nome, id, partidas),

  listar: () =>
    filaService.listar(),

  jogar: (id) =>
    filaService.jogar(id),

  renomear: (a, b) =>
    filaService.renomear(a, b),

  topDoadores: () =>
    filaService.topDoadores(),

  addPartidas: (id, qtd) =>
    filaService.addPartidas(id, qtd),

  remPartidas: (id, qtd) =>
    filaService.remPartidas(id, qtd),

  info: (id) =>
    filaService.info(id),

  reset: () =>
    filaService.reset()
};