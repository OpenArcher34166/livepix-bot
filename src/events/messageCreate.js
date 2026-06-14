const filaController = require("../controllers/filaController");
const hasPermission = require("../middleware/hasPermission");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const args = message.content.trim().split(" ");
    const cmd = args[0];

    try {

      // =========================
      // 🎮 ADD MANUAL (LIBERADO)
      // =========================
      if (cmd === "!add") {
        const id = args[1];
        const partidas = Number(args[2]);
        const nome = args.slice(3).join(" ");

        if (!id || !nome || isNaN(partidas)) {
          return message.reply("Uso: !add id partidas nome");
        }

        await filaController.adicionarManual(nome, id, partidas);
        return message.reply("🎮 Partidas adicionadas (manual)");
      }

      // =========================
      // 💰 CRÉDITO (MOD+)
      // =========================
      if (cmd === "!credito") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const id = args[1];
        const valor = Number(args[2]);

        if (!id || isNaN(valor) || valor <= 0) {
          return message.reply("Uso: !credito id valor válido");
        }

        await filaController.adicionar("LIVEPIX", id, valor);

        return message.reply(
          `💰 Crédito adicionado: R$ ${valor.toFixed(2)}`
        );
      }

      // =========================
      // 📋 FILA (TODOS)
      // =========================
      if (cmd === "!fila") {
        const fila = await filaController.listar();

        const texto = fila.map(j =>
          `Nome: ${j.nome_pix || "N/A"} | ID: ${j.id_freefire} | Partidas: ${j.partidas} | Crédito: R$ ${(Number(j.saldo_credito || 0)).toFixed(2)}`
        ).join("\n");

        return message.reply("📋 Fila:\n" + texto);
      }

      // =========================
      // 🎮 JOGAR (TODOS)
      // =========================
      if (cmd === "!jogar") {
        const res = await filaController.jogar(args[1]);

        if (!res) return message.reply("Não encontrado");
        if (res.finalizado) return message.reply("🏁 Finalizado!");

        return message.reply(`🎮 Restam ${res.partidas}`);
      }

      // =========================
      // 🔄 RENOMEAR (MOD+)
      // =========================
      if (cmd === "!renomear") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const ok = await filaController.renomear(args[1], args[2]);

        if (!ok) return message.reply("Não encontrado");

        return message.reply(`✅ Alterado`);
      }

      // =========================
      // ➕ ADD PARTIDAS (MOD+)
      // =========================
      if (cmd === "!addpartidas") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const id = args[1];
        const qtd = Number(args[2]);

        const ok = await filaController.addPartidas(id, qtd);

        if (!ok) return message.reply("Não encontrado");

        return message.reply(`➕ ${qtd} partidas adicionadas`);
      }

      // =========================
      // ➖ REM PARTIDAS (MOD+)
      // =========================
      if (cmd === "!rempartidas") {
        if (!hasPermission(message, "MOD")) {
          return message.reply("❌ Sem permissão.");
        }

        const id = args[1];
        const qtd = Number(args[2]);

        const ok = await filaController.remPartidas(id, qtd);

        if (!ok) return message.reply("Não encontrado");

        return message.reply(`➖ ${qtd} partidas removidas`);
      }

      // =========================
      // 📊 INFO (TODOS)
      // =========================
      if (cmd === "!info") {
        const j = await filaController.info(args[1]);

        if (!j) return message.reply("Não encontrado");

        return message.reply(
`📊 INFO
ID: ${j.id_freefire}
Pix: ${j.nome_pix}
Partidas: ${j.partidas}`
        );
      }

      // =========================
      // 💣 RESET (ADMIN ONLY)
      // =========================
      if (cmd === "!resetfila") {
        if (!hasPermission(message, "ADMIN")) {
          return message.reply("❌ Apenas ADMIN pode usar isso.");
        }

        await filaController.reset();
        return message.reply("💣 Fila resetada!");
      }

      // =========================
      // 🏆 TOP 10 (TODOS)
      // =========================
      if (cmd === "!top10") {
        const top = await filaController.topDoadores();

        const texto = top.map((d, i) =>
          `#${i + 1} ${d.nome_pix} | R$ ${Number(d.total).toFixed(2)}`
        ).join("\n");

        return message.reply("🏆 TOP 10:\n" + texto);
      }

      // =========================
      // ❓ HELP (TODOS)
      // =========================
      if (cmd === "!help") {
        const { EmbedBuilder } = require("discord.js");

        const embed = new EmbedBuilder()
          .setColor("#00AEEF")
          .setTitle("🤖 Sistema LivePix Bot")
          .setDescription("Sistema profissional de fila e créditos")
          .addFields(
            {
              name: "🎮 JOGADORES",
              value:
                "`!add` - Adiciona jogador\n" +
                "`!fila` - Mostra fila\n" +
                "`!jogar` - Registra partida\n" +
                "`!info` - Info jogador",
            },
            {
              name: "💰 FINANCEIRO",
              value:
                "`!credito` - Adiciona crédito\n" +
                "`!top10` - Ranking doadores",
            },
            {
              name: "⚙️ ADMIN / MOD",
              value:
                "`!addpartidas`\n!rempartidas\n!renomear\n!resetfila"
            }
          )
          .setFooter({ text: "LivePix Bot • Sistema profissional" })
          .setTimestamp();

        return message.reply({ embeds: [embed] });
      }

   const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

if (cmd === "!painel") {

  const embed = new EmbedBuilder()
    .setColor("#00AEEF")
    .setTitle("🎮 Painel LivePix Bot")
    .setDescription("Controle rápido da fila de partidas")
    .addFields(
      { name: "📋 Fila", value: "Ver jogadores na fila", inline: true },
      { name: "🏆 Ranking", value: "Top doadores", inline: true },
      { name: "🎮 Jogar", value: "Registrar partida", inline: true }
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("fila")
      .setLabel("📋 Fila")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("top10")
      .setLabel("🏆 Top 10")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("jogar")
      .setLabel("🎮 Jogar")
      .setStyle(ButtonStyle.Danger)
  );

  return message.reply({
    embeds: [embed],
    components: [row]
  });
}
    } catch (err) {
      console.log(err);
      return message.reply("Erro interno");
    }
  });
};