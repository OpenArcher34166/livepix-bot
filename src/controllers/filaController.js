const filaService = require("../services/filaService");

module.exports = {
  // 💰 LivePix automático
  adicionar: async (nome, id, valor) => {
    return await filaService.adicionar(nome, id, valor);
  },

  // 🎮 Adição manual de partidas
  adicionarManual: async (nome, id, partidas) => {
    return await filaService.adicionarManual(nome, id, partidas);
  },

  // 📋 Lista fila
  listar: async () => {
    return await filaService.listar();
  },

  // 🎮 Remove partida quando joga
  jogar: async (id) => {
    return await filaService.jogar(id);
  },

  // ✏️ Renomear ID FF
  renomear: async (a, b) => {
    return await filaService.renomear(a, b);
  },

  // 🏆 Top doadores
  topDoadores: async () => {
    return await filaService.topDoadores();
  }
};