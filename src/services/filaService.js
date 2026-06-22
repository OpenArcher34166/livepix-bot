const filaModel = require("../models/filaModel");
const historicoModel = require("../models/historicoModel");
const configuracaoModel = require("../models/configuracaoModel");
console.log("CONFIG MODEL:");
console.log(configuracaoModel);

console.log("ARQUIVO FILASERVICE CARREGADO");
console.log(__filename);

// =========================
// 💰 LIVEPIX / CRÉDITO
// =========================
async function adicionar(guildId, nome, id, valor) {


  const jogador = await filaModel.buscarPorIdFF(guildId, id);

  let partidasGeradas = 0;


console.log("GUILD:", guildId);
console.log("TIPO:", typeof configuracaoModel.obterConfiguracao);


const config =
  await configuracaoModel.obterConfiguracao(
  guildId
  );

const valorPartida =
  Number(config?.valor_partida || 2);





if (!jogador) {
partidasGeradas =
  Math.floor(valor / valorPartida);

const credito =
  +(valor - partidasGeradas * valorPartida).toFixed(2);



    await filaModel.adicionarJogador(
      guildId,
      nome,
      id,
      valor,
      partidasGeradas,
      credito
    );

    await historicoModel.registrar(
      guildId,
      "DOACAO",
      nome,
      id,
      valor,
      partidasGeradas
    );

    return;
  }

  const total = Number(valor) + Number(jogador.saldo_credito || 0);

  partidasGeradas =
  Math.floor(total / valorPartida);

const credito =
  +(total - partidasGeradas * valorPartida).toFixed(2);



  await filaModel.atualizarJogador(
    guildId,
    id,
    jogador.partidas + partidasGeradas,
    credito,
    valor
  );

  await historicoModel.registrar(
    guildId,
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
async function adicionarManual(guildId, nome, id, partidas) {
  const jogador = await filaModel.buscarPorIdFF(guildId, id);

  if (!jogador) {
    await filaModel.adicionarJogador(
      guildId,
      nome,
      id,
      0,
      partidas,
      0
    );
  } else {
    await filaModel.atualizarJogador(
      guildId,
      id,
      jogador.partidas + partidas,
      jogador.saldo_credito || 0,
      0
    );
  }

  await historicoModel.registrar(
    guildId,
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
async function listar(guildId) {
  return filaModel.listarFila(guildId);
}

// =========================
// 🎮 JOGAR
// =========================
async function jogar(guildId, id) {
  const jogador = await filaModel.buscarPorIdFF(guildId, id);

  if (!jogador) return null;

  await filaModel.removerPartidas(guildId, id, 1);

  await historicoModel.registrar(
    guildId,
    "JOGOU",
    jogador.nome_pix,
    id,
    0,
    1
  );

  const atualizado = await filaModel.buscarPorIdFF(guildId, id);

  if (atualizado.partidas <= 0) {
    await filaModel.finalizarJogador(guildId, id);

    await historicoModel.registrar(
      guildId,
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
async function renomear(guildId, a, b) {
  const jogador = await filaModel.buscarPorIdFF(guildId, a);

  if (!jogador) return null;

  await filaModel.renomearId(guildId, a, b);

  await historicoModel.registrar(
    guildId,
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
async function topDoadores(guildId) {
  return filaModel.topDoadores(guildId);
}  
// =========================
// ➕ ADD PARTIDAS
// =========================
async function addPartidas(guildId, id, qtd) {
  const jogador = await filaModel.buscarPorIdFF(guildId, id);

  if (!jogador) return false;

  await filaModel.adicionarPartidas(guildId, id, qtd);

  await historicoModel.registrar(
    guildId,
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
async function remPartidas(guildId, id, qtd) {
  const jogador = await filaModel.buscarPorIdFF(guildId, id);

  if (!jogador) return false;

  await filaModel.removerPartidas(guildId, id, qtd);

  await historicoModel.registrar(
    guildId,
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
async function info(guildId, id) {
  return filaModel.buscarPorIdFF(guildId, id);
}

// =========================
// 💣 RESET
// =========================
async function reset(guildId) {
  await filaModel.resetFila(guildId);

  await historicoModel.registrar(
    guildId,
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