const filaController = require("../controllers/filaController");
const hasPermission = require("../middleware/hasPermission");
const atualizarPainel = require("../utils/atualizarPainel");
const configuracaoModel =
require("../models/configuracaoModel");

const setupServidorModule = require("../utils/setupServidor");
console.log(setupServidorModule);

const setupServidor =
  setupServidorModule.default ||
  setupServidorModule.setupServidor ||
  setupServidorModule;

console.log("TIPO SETUP:", typeof setupServidor);

module.exports = (client) => {
console.log("✅ MESSAGECREATE CARREGADO");




  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    console.log("MENSAGEM RECEBIDA:", message.content);



    const args = message.content.trim().split(" ");
    const cmd = args[0];

    const isValidNumber = (value) => !isNaN(value) && Number(value) > 0;

    try {

      // =========================
      // 🎮 ADD MANUAL
      // =========================
      if (cmd === "!add") {
        const id = args[1];
        const partidas = Number(args[2]);
        const nome = args.slice(3).join(" ").trim();

        if (!id || !nome || !isValidNumber(partidas)) {
          return message.reply("❌ Uso correto: !add id partidas nome");
        }

        if (nome.length < 2) {
          return message.reply("❌ Nome inválido");
        }

        await filaController.adicionarManual(message.guild.id, nome, id, partidas);

       await atualizarPainel(
  client,
  message.guild.id
);

        return message.reply("🎮 Jogador adicionado com sucesso!");
      }

      // =========================
      // 💰 CRÉDITO
      // =========================
      if (cmd === "!credito") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const id = args[1];
        const valor = Number(args[2]);

        if (!id || !isValidNumber(valor)) {
          return message.reply("❌ Uso: !credito id valor");
        }

        await filaController.adicionar(message.guild.id, "LIVEPIX", id, valor);
        await atualizarPainel(
  client,
  message.guild.id
);

        return message.reply(`💰 Crédito adicionado: R$ ${valor.toFixed(2)}`);
      }

    // =========================
    // 💰 SETPRECO
    // =========================
if (cmd === "!setpreco") {

  if (!hasPermission(message, "ADMIN")) {
    return message.reply(
      "❌ Apenas ADMIN pode alterar."
    );
  }

  const valor = Number(args[1]);

  if (!valor || valor <= 0) {
    return message.reply(
      "❌ Use: !setpreco 2"
    );
  }

  await configuracaoModel.definirPreco(
    "GLOBAL",
    valor
  );

  return message.reply(
    `✅ Valor da partida definido para R$ ${valor.toFixed(2)}`
  );
}
    // =========================
    // 💰 Preço
    // =========================
if (cmd === "!preco") {

  const config =
    await configuracaoModel.obterConfiguracao(
      "GLOBAL"
    );

  const valor =
    Number(config?.valor_partida || 2);

  return message.reply(
    `💰 Valor atual da partida: R$ ${valor.toFixed(2)}`
  );
}



      // =========================
      // 📋 FILA
      // =========================
      if (cmd === "!fila") {
  const fila = await filaController.listar(message.guild.id);

  if (!fila || fila.length === 0) {
    return message.reply("📋 Nenhum jogador na fila.");
  }

  let total = 0;

  const texto = fila.map((j, i) => {
    total += Number(j.valor || 0);

    return `${i + 1}️⃣ ${j.nome_pix}
ID: ${j.id_freefire}
🎮 Partidas: ${j.partidas}`;
  }).join("\n\n");

  return message.reply(
`📋 FILA DE PARTIDAS

${texto}

━━━━━━━━━━━━━━━

👥 Jogadores: ${fila.length}
💰 Total arrecadado: R$ ${total.toFixed(2)}`
  );
}

      // =========================
      // 🎮 JOGAR
      // =========================
      if (cmd === "!jogar") {
        const id = args[1];

        if (!id) {
          return message.reply("❌ Use: !jogar id");
        }

        const res = await filaController.jogar(message.guild.id, id);

       await atualizarPainel(
  client,
  message.guild.id
);

        if (!res) return message.reply("❌ Jogador não encontrado");
        if (res.finalizado) return message.reply("🏁 Jogador finalizado!");

        return message.reply(`🎮 Restam ${res.partidas}`);
      }

      // =========================
      // 🔄 RENOMEAR
      // =========================
      if (cmd === "!renomear") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const oldId = args[1];
        const newId = args[2];

        if (!oldId || !newId) {
          return message.reply("❌ Uso: !renomear antigo novo");
        }

        const ok = await filaController.renomear(message.guild.id, oldId, newId);

        await atualizarPainel(
  client,
  message.guild.id
);

        if (!ok) return message.reply("❌ Não encontrado");

        return message.reply("✅ ID atualizado com sucesso");
      }

      // =========================
      // ➕ ADD PARTIDAS
      // =========================
      if (cmd === "!addpartidas") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const id = args[1];
        const qtd = Number(args[2]);

        if (!id || !isValidNumber(qtd)) {
          return message.reply("❌ Uso: !addpartidas id quantidade");
        }

        const ok = await filaController.addPartidas(message.guild.id, id, qtd);

        await atualizarPainel(
  client,
  message.guild.id
);

        if (!ok) return message.reply("❌ Não encontrado");

        return message.reply(`➕ ${qtd} partidas adicionadas`);
      }

      // =========================
      // ➖ REM PARTIDAS
      // =========================
      if (cmd === "!rempartidas") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const id = args[1];
        const qtd = Number(args[2]);

        if (!id || !isValidNumber(qtd)) {
          return message.reply("❌ Uso: !rempartidas id quantidade");
        }

        const ok = await filaController.remPartidas(message.guild.id, id, qtd);

        await atualizarPainel(
  client,
  message.guild.id
);

        if (!ok) return message.reply("❌ Não encontrado");

        return message.reply(`➖ ${qtd} partidas removidas`);
      }

      // =========================
      // 📊 INFO
      // =========================
      if (cmd === "!info") {
        const id = args[1];

        if (!id) {
          return message.reply("❌ Use: !info id");
        }

        const j = await filaController.info(message.guild.id, id);

        if (!j) {
          return message.reply("❌ Não encontrado");
        }

        return message.reply(
`📊 INFO

👤 Nome: ${j.nome_pix}
🆔 ID: ${j.id_freefire}
🎮 Partidas: ${j.partidas}
💰 Total: R$ ${Number(j.valor || 0).toFixed(2)}
💳 Crédito: R$ ${Number(j.saldo_credito || 0).toFixed(2)}
📌 Status: ${j.status}`
        );
      }

      // 💣 RESET FILA
      // =========================
      if (cmd === "!resetfila") {
        if (!hasPermission(message, "ADMIN")) {
          return message.reply("❌ Apenas ADMIN pode usar isso.");
        }

        await filaController.reset(message.guild.id);
await atualizarPainel(
  client,
  message.guild.id
);
        return message.reply("💣 Fila resetada!");
      }

      // =========================
      // 🏆 TOP 10
      // =========================
      if (cmd === "!top10") {
        const top = await filaController.topDoadores(message.guild.id);

        if (!top || top.length === 0) {
          return message.reply("🏆 Sem dados ainda.");
        }

        const texto = top.map((d, i) =>
          `#${i + 1} ${d.nome_pix || "N/A"} | R$ ${Number(d.total || 0).toFixed(2)}`
        ).join("\n");

        return message.reply("🏆 TOP 10:\n" + texto);
      }

// =========================
// ⚙️ SETUP SERVIDOR
// =========================
if (cmd === "!setup") {

  try {

    console.log("🚀 COMANDO SETUP EXECUTADO");
    console.log("TIPO SETUP:", typeof setupServidor);

    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Apenas administradores.");
    }

    await message.reply("⚙️ Criando estrutura...");

    const resultado = await setupServidor(message.guild);

    console.log("✅ SETUP CONCLUÍDO");
    console.log(resultado);

    return message.channel.send(
      "✅ Estrutura criada com sucesso!"
    );

  } catch (err) {

    console.error("❌ ERRO SETUP:");
    console.error(err);

    return message.reply(
      `❌ SETUP: ${err.message}`
    );
  }
}

    } catch (err) {
  console.error("❌ ERRO DEBTRU:");
  console.error(err);

  return message.reply(
    `❌ ${err.message}`
  );
}
  });
};