const filaModel = require("../models/filaModel");
const historicoModel = require("../models/historicoModel");

// =========================
// 💰 LIVEPIX / CRÉDITO
// =========================
async function adicionar(nome, id, valor) {
  const jogador = await filaModel.buscarPorIdFF(id);

  let partidasGeradas = 0;

  if (!jogador) {
    partidasGeradas = Math.floor(valor / 2);
    const credito = +(valor - partidasGeradas * 2).toFixed(2);

    await filaModel.adicionarJogador(
      nome,
      id,
      valor,
      partidasGeradas,
      credito
    );

    await historicoModel.registrar(
      "DOACAO",
      nome,
      id,
      valor,
      partidasGeradas
    );

    return;
  }

  const total = Number(valor) + Number(jogador.saldo_credito || 0);

  partidasGeradas = Math.floor(total / 2);

  const credito = +(total - partidasGeradas * 2).toFixed(2);

  await filaModel.atualizarJogador(
    id,
    jogador.partidas + partidasGeradas,
    credito,
    valor
  );

  await historicoModel.registrar(
    "DOACAO",
    nome,
    id,
    valor,
    partidasGeradas
  );
}

// =========================
// 🎮 ADD MANUAL
// =========================
async function adicionarManual(nome, id, partidas) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) {
    await filaModel.adicionarJogador(
      nome,
      id,
      0,
      partidas,
      0
    );
  } else {
    await filaModel.atualizarJogador(
      id,
      jogador.partidas + partidas,
      jogador.saldo_credito || 0,
      0
    );
  }

  await historicoModel.registrar(
    "ADD_MANUAL",
    nome,
    id,
    0,
    partidas
  );
}

// =========================
// 📋 LISTAR FILA
// =========================
async function listar() {
  return filaModel.listarFila();
}

// =========================
// 🎮 JOGAR
// =========================
async function jogar(id) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) return null;

  await filaModel.removerPartidas(id, 1);

  await historicoModel.registrar(
    "JOGOU",
    jogador.nome_pix,
    id,
    0,
    1
  );

  const atualizado = await filaModel.buscarPorIdFF(id);

  if (atualizado.partidas <= 0) {
    await filaModel.finalizarJogador(id);

    await historicoModel.registrar(
      "FINALIZADO",
      jogador.nome_pix,
      id,
      0,
      0
    );

    return {
      finalizado: true
    };
  }

  return {
    finalizado: false,
    partidas: atualizado.partidas
  };
}

// =========================
// ✏️ RENOMEAR
// =========================
async function renomear(a, b) {
  const jogador = await filaModel.buscarPorIdFF(a);

  if (!jogador) return null;

  await filaModel.renomearId(a, b);

  await historicoModel.registrar(
    "RENOMEAR",
    jogador.nome_pix,
    `${a} -> ${b}`,
    0,
    0
  );

  return true;
}

// =========================
// 🏆 TOP DOADORES
// =========================
async function topDoadores() {
  return filaModel.topDoadores();
}  
// =========================
// ➕ ADD PARTIDAS
// =========================
async function addPartidas(id, qtd) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) return false;

  await filaModel.adicionarPartidas(id, qtd);

  await historicoModel.registrar(
    "ADD_PARTIDAS",
    jogador.nome_pix,
    id,
    0,
    qtd
  );

  return true;
}

// =========================
// ➖ REM PARTIDAS
// =========================
async function remPartidas(id, qtd) {
  const jogador = await filaModel.buscarPorIdFF(id);

  if (!jogador) return false;

  await filaModel.removerPartidas(id, qtd);

  await historicoModel.registrar(
    "REM_PARTIDAS",
    jogador.nome_pix,
    id,
    0,
    qtd
  );

  return true;
}

// =========================
// 📊 INFO
// =========================
async function info(id) {
  return filaModel.buscarPorIdFF(id);
}

// =========================
// 💣 RESET
// =========================
async function reset() {
  await filaModel.resetFila();

  await historicoModel.registrar(
    "RESET",
    "SISTEMA",
    "FILA",
    0,
    0
  );

  return true;
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