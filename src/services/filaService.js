const filaModel = require("../models/filaModel");

// 🔥 FUNÇÃO EXISTENTE (CRÉDITO / LIVEPIX SIMULADO)
async function adicionar(nome, id, valor) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) {
    const partidas = Math.floor(valor / 2);
    const credito = +(valor - partidas * 2).toFixed(2);

    return filaModel.adicionarJogador(
      nome,
      id,
      valor,
      partidas,
      credito
    );
  }

  const total = Number(valor) + Number(jogador.saldo_credito || 0);

  const partidasNovas = Math.floor(total / 2);
  const credito = +(total - partidasNovas * 2).toFixed(2);

  return filaModel.atualizarJogador(
    id,
    jogador.partidas + partidasNovas,
    credito,
    valor
  );
}

// 🔥 NOVO: ADICIONAR SÓ PARTIDAS (MANUAL)
async function adicionarManual(nome, id, partidas) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) {
    return filaModel.adicionarJogador(nome, id, 0, partidas, 0);
  }

  return filaModel.atualizarJogador(
    id,
    jogador.partidas + partidas,
    jogador.saldo_credito || 0,
    0
  );
}

// resto igual
async function listar() {
  return filaModel.listarFila();
}

async function jogar(id) {
  const j = await filaModel.buscarPorIdFF(id);
  if (!j) return null;

  await filaModel.removerPartidas(id, 1);

  const updated = await filaModel.buscarPorIdFF(id);

  if (updated.partidas <= 0) {
    await filaModel.finalizarJogador(id);
    return { finalizado: true };
  }

  return { finalizado: false, partidas: updated.partidas };
}

async function renomear(a, b) {
  const j = await filaModel.buscarPorIdFF(a);
  if (!j) return null;

  await filaModel.renomearId(a, b);
  return true;
}

async function topDoadores() {
  return filaModel.topDoadores();
}

async function addPartidas(id, qtd) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) return null;

  await filaModel.adicionarPartidas(id, qtd);

  return true;
}

async function remPartidas(id, qtd) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) return null;

  await filaModel.removerPartidas(id, qtd);

  return true;
}

async function info(id) {
  return await filaModel.buscarPorIdFF(id);
}

async function reset() {
  return await filaModel.resetFila();
}

module.exports = {
  adicionar,
  adicionarManual,
  listar,
  jogar,
  renomear,
  topDoadores,
  addPartidas,
  remPartidas,
  info,
  reset
};